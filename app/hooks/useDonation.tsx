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
type Donation = Tables<'donation'>;
type DonationWithDetails = Tables<'donation_with_details'>;



/* DONOR HOOKS */

const fetchDonationWithDetails = async (): Promise<DonationWithDetails[]> => {
    const { data, error } = await supabase
        .from('donation_with_details')
        .select('*');
    if (error) {
        throw error;
    }

    if (!data) {
        return []; // Return an empty array if no data
    }

    // Process images for each donation
    const donationsWithCachedImages = await Promise.all(
        data.map(async (donation) => {
            // Cache all images
            const cachedImages = await Promise.all(
                (donation.images || []).map(async (path: string) => {
                    const cachedImage = await getCachedImage(path);
                    return cachedImage;
                })
            );

            // Return donation with cached images
            return { ...donation, images: cachedImages };
        })
    );

    return donationsWithCachedImages;
};

const fetchDonations = async (): Promise<Donation[]> => {
    const { data, error } = await supabase
        .from('donation')
        .select('*');

    if (error) {
        throw error;
    }

    return data || [];
}

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
    // Fetch donation requests with associated items
    const { data, error } = await supabase
        .from('donation_requests_with_categories_and_tags')
        .select(`
            *,
            item (id, name, quantity, status, donationRequest_ID)
        `); // This selects related items

    if (error) {
        throw error;
    }

    if (!data) {
        return []; // Return an empty array if no data
    }

    // Filter out donation requests that only have 'COMPLETE' items
    const filteredData = data.filter(request => 
        request.status === 'AVAILABLE' || request.status === 'PENDING'
    );

    // Process images as before
    const requestsWithImages = await Promise.all(
        filteredData.map(async (request) => {
            const images = await Promise.all(
                (request.images || []).map(async (path: string) => {
                    const cachedImage = await getCachedImage(path);
                    return cachedImage;
                })
            );

            return { ...request, images };
        })
    );
    console.log(requestsWithImages)
    return requestsWithImages || [];
};

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


const fetchDonationsByDonors = async (profileId: string): Promise<DonationWithDetails[]> => {
    const { data, error } = await supabase
        .from('donation_with_details')
        .select('*')
        .eq('donor_ID', profileId);

    if (error) {
        throw error;
    }

    if (!data) {
        return [];
    }

    // Process images as before
    const donationsWithCachedImages = await Promise.all(
        data.map(async (donation) => {
            const cachedImages = await Promise.all(
                (donation.images || []).map(async (path: string) => {
                    const cachedImage = await getCachedImage(path);
                    return cachedImage;
                })
            );

            return { ...donation, images: cachedImages };
        })
    );

    return donationsWithCachedImages;
};


const fetchDonationsByBeneficiary = async (profileId: string): Promise<DonationWithDetails[]> => {
    const { data, error } = await supabase
        .from('donation_with_details')
        .select('*')
        .eq('beneficiary_ID', profileId);

    if (error) {
        throw error;
    }

    if (!data) {
        return [];
    }
    // Process images as before
    const donationsWithCachedImages = await Promise.all(
        data.map(async (donation) => {
            const cachedImages = await Promise.all(
                (donation.images || []).map(async (path: string) => {
                    const cachedImage = await getCachedImage(path);
                    return cachedImage;
                })
            );

            return { ...donation, images: cachedImages };
        })
    );

    return donationsWithCachedImages;
};


/* ADMIN HOOKS*/

const fetchDonationRequestsByBeneficiary = async (profileId: string): Promise<DonationRequestWithCategoryAndTags[]> => {
    const { data, error } = await supabase
        .from('donation_requests_with_categories_and_tags')
        .select('*')
        .eq('beneficiary_ID', profileId);

    if (error) {
        throw error;
    }
    const donationRequestWithCachedImages = await Promise.all(
        data.map(async (request) => {
            // Cache all images
            const cachedImages = await Promise.all(
                (request.images || []).map(async (path: string) => {
                    const cachedImage = await getCachedImage(path);
                    return cachedImage;
                })
            );

            // Return donation with cached images
            return { ...request, images: cachedImages };
        })
    );

    return donationRequestWithCachedImages;
    

};


const fetchDonationRequestsWithCategoryAndTagsByBeneficiary = async (profileId: string): Promise<DonationRequestWithCategoryAndTags[]> => {
    const { data, error } = await supabase
        .from('donation_requests_with_categories_and_tags')
        .select('*')
        .eq('beneficiary_ID', profileId);

    if (error) {
        throw error;
    }
    
    return data || [];
};
const fetchDonationsByRequest = async (requestIds: number[]): Promise<Donation[]> => {
    const { data, error } = await supabase
        .from('donation')
        .select('*')
        .in('donationRequest_ID', requestIds); // Fetching donations for the request IDs

    if (error) {
        throw error;
    }

    return data || [];
}

const fetchItemsByDonationRequest = async (requestId: number): Promise<Item[]> => {
    const { data, error } = await supabase
        .from('item')
        .select('*')
        .eq('donationRequest_ID', requestId);

    if (error) {
        throw error;
    }

    return data || [];
}

const fetchItemsByDonation = async (itemIds: number[]): Promise<Item[]> => {
    const { data, error } = await supabase
        .from('item')
        .select('*')
        .in('id', itemIds);  // Fetching based on item IDs

    if (error) {
        throw error;
    }

    return data || [];
};

// React Query hook to fetch items by multiple donation IDs

export const useItemsByDonationRequest = (requestId: number) => {
    return useQuery(['itemsByDonationRequest', requestId], () => fetchItemsByDonationRequest(requestId));
}

export const useItemsByDonation = (itemIds: number[]) => {
    return useQuery(['itemsByDonation', itemIds], () => fetchItemsByDonation(itemIds), {
        enabled: !!itemIds.length,  // Only run if itemIds array is not empty
    });
};

  
export const useDonationsByRequest = (requestIds: number[]) => {
    return useQuery(['donationsByRequest', requestIds], () => fetchDonationsByRequest(requestIds), {
        enabled: requestIds.length > 0, // Only run if there are request IDs
      });}

export const useDonationByBeneficiary = () => {
    const { profile } = useAuth();

    if (!profile?.id) {
        throw new Error('User is not authenticated or profile ID is missing');
    }
    return useQuery(['donationsByBeneficiary', profile.id], () => fetchDonationsByBeneficiary(profile.id));
}

export const useDonationsByDonor = () => {
    const { profile } = useAuth();

    if (!profile?.id) {
        throw new Error('User is not authenticated or profile ID is missing');
    }

    return useQuery(['donationsByDonor', profile.id], () => fetchDonationsByDonors(profile.id));
}
    



export const useDonationWithDetails = () => {
    return useQuery('donationWithDetails', fetchDonationWithDetails);
}
  export const useDonations = () => {
    return useQuery('donations', fetchDonations);
}
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

export const useDonationRequestsByBeneficiary = () => {
    const { profile } = useAuth(); // Extract profile from useAuth

    // Ensure profile is available before fetching
    if (!profile?.id) {
        throw new Error('User is not authenticated or profile ID is missing');
    }

    return useQuery(['donationRequests', profile.id], () => fetchDonationRequestsByBeneficiary(profile.id));
};
export const useDonationRequestsWithCategoryAndTagsByProfile = () => {
    const { profile } = useAuth();

    if (!profile?.id) {
        throw new Error('User is not authenticated or profile ID is missing');
    }

    return useQuery(['donationRequestsWithCategoryAndTags', profile.id], () => fetchDonationRequestsWithCategoryAndTagsByBeneficiary(profile.id));
};