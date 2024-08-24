import {supabase} from '@/lib/supabase';
import {useQuery} from 'react-query';
import {Alert} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../providers/Auth';
import { Tables } from '../database.types';

/* Types */

type DonationRequest = Tables<'donationRequest'>;
type DonationRequestWithCategoryAndTags = Tables<'donation_requests_with_categories_and_tags'>;
type Categories = Tables<'category'>;



/* DONOR HOOKS */

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

    return data || [];
}






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