import {supabase} from '@/lib/supabase';
import {useQuery} from 'react-query';
import {Alert} from 'react-native';


interface DonationRequest {
    id: string;
    headline: string;
    description: string;
    status: string;
    latitude: number;
    longitude: number;
    formatted_address: string;
    main_location: string;
    secondary_location: string;
    images: string[];  // Array of image URLs
    category_id?: string;  // Assuming category_id might be optional
    category_name?: string;  // Optional if using with category data
    tag_names?: string[];  // Optional if using with tags data
    item_names?: string[];  // Optional if using with item data
  }


  interface DonationRequestWithCategoryAndTags extends DonationRequest {
    category_name: string;
    tag_names: string[];
    item_names: string[];
  }


const fetchDonationRequests = async (): Promise<DonationRequest[]> => {

        const { data, error } = await supabase.from('donationRequest').select('*');
        if (error) {
            throw error;
        }
        return data || [];
   
}

const fetchDonationRequestsWithCategoryAndTags = async () => {
    try{

const { data, error } = await supabase.from('donation_requests_with_categories_and_tags').select('*');
    if (error) {
        throw error;
    }
    return data;
    }catch (error) {
        console.error('Error fetching donation requests:', error);
    }

}

export const useDonationRequests = () => {
    return useQuery('donationRequests', fetchDonationRequests);

};

export const useDonationRequestsWithCategoryAndTags = () => {
    return useQuery('donationRequestsWithCategoryAndTags', fetchDonationRequestsWithCategoryAndTags);
};