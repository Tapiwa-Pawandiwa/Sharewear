import {supabase} from '@/lib/supabase';
import {useQuery} from 'react-query';
import {Alert} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../providers/Auth';
import * as FileSystem from 'expo-file-system';
import { Tables } from '@/app/database.types';

/* Types */

type DonationRequest = Tables<'donationRequest'>;
type DonationRequestWithCategoryAndTags = Tables<'donation_requests_with_categories_and_tags'>;
type Categories = Tables<'category'>;
type Item = Tables<'item'>;



/* DONOR HOOKS */


const fetchItems = async (): Promise<Item[]> => {
    const {data,error } = await supabase.from ('item').select('*');

    if (error) {
        throw error;
    }
    return data || [];
}


const fetchDonationRequests = async (): Promise<DonationRequest[]> => {
    const { data, error } = await supabase
        .from('donationRequest')
        .select('*');

    if (error) {
        throw error;
    }

    return data || [];
}

const fetchCategories = async (): Promise<Categories[]> => {
    const {data, error } = await supabase
        .from('category')
        .select('*');

    if (error) {
        throw error;
    }
    return data || [];

}


const fetchDonationRequestsWithCategory = async (): Promise<DonationRequestWithCategoryAndTags[]> => {
    const { data, error } = await supabase
        .from('donation_requests_with_categories_and_tags')
        .select('*');

    if (error) {
        throw error;
    }
  
        const requestsWithImages = await Promise.all(
          data.map(async (request) => {
            const images = await Promise.all(
              (request.images || []).map(async (path:string) => {
                const cachedImage = await getCachedImage(path);
                return cachedImage;
              })
            );
      
            return { ...request, images };
          })
        );
      
        return requestsWithImages  || [];

}


const getCachedImage = async (path: string): Promise<string | null> => {
    const cacheDir = `${FileSystem.cacheDirectory}images/`;
    const fileUri = `${cacheDir}${path.replace(/\//g, '_')}`; // Replace slashes with underscores to avoid path issues
  
    // Check if the file already exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
        return fileUri;
    }
  
    // If not, download the image from Supabase
    const { data, error } = await supabase.storage.from('donationRequestImages').download(path);
    if (error || !data) {
        console.error(error);
        return null;
    }
  
    // Convert Blob to Base64
    const reader = new FileReader();
    const blob = data as Blob;

    return new Promise<string | null>((resolve, reject) => {
        reader.onloadend = async () => {
            const base64data = (reader.result as string)?.split(',')[1]; // Explicitly assert result as string
            if (base64data) {
                // Ensure the cache directory exists
                await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });

                // Write the image to the cache directory
                await FileSystem.writeAsStringAsync(fileUri, base64data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                resolve(fileUri);
            } else {
                reject("Failed to convert blob to base64.");
            }
        };
        reader.onerror = () => reject("Failed to read the blob.");
        reader.readAsDataURL(blob); // Read the Blob object
    });
};




/* ADMIN HOOKS*/

const fetchDonationRequestsPerProfile = async (profileId: string): Promise<DonationRequest[]> => {
    const { data, error } = await supabase
        .from('donationRequest')
        .select('*')
        .eq('beneficiary_ID', profileId);

    if (error) {
        throw error;
    }
    
    return data || [];
};

const fetchDonationRequestsWithCategoryAndTagsPerProfile = async (profileId: string): Promise<DonationRequestWithCategoryAndTags[]> => {
    const { data, error } = await supabase
        .from('donation_requests_with_categories_and_tags')
        .select('*')
        .eq('beneficiary_ID', profileId);

    if (error) {
        throw error;
    }
    
    return data || [];
};

  ///-----------------------------------//

export const useItems = () => {
    return useQuery('items', fetchItems);
};
export const useDonationRequests = () => {
    return useQuery('donationRequests', fetchDonationRequests);
};

export const useCategories = () => {
    return useQuery('categories', fetchCategories);
};
export const useDonationRequestsWithCategory = () => {
    return useQuery('donationRequestsWithCategory', fetchDonationRequestsWithCategory);
}

export const useDonationRequestsByProfile = () => {
    const { profile } = useAuth(); // Extract profile from useAuth

    // Ensure profile is available before fetching
    if (!profile?.id) {
        throw new Error('User is not authenticated or profile ID is missing');
    }

    return useQuery(['donationRequests', profile.id], () => fetchDonationRequestsPerProfile(profile.id));
};
export const useDonationRequestsWithCategoryAndTagsByProfile = () => {
    const { profile } = useAuth();

    if (!profile?.id) {
        throw new Error('User is not authenticated or profile ID is missing');
    }

    return useQuery(['donationRequestsWithCategoryAndTags', profile.id], () => fetchDonationRequestsWithCategoryAndTagsPerProfile(profile.id));
};