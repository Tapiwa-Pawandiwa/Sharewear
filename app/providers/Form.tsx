import React,{createContext, useContext,useEffect, useState,ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from './Auth';
import { decode } from 'base64-arraybuffer'
import { Alert } from 'react-native';
import { Redirect } from 'expo-router';



interface Item {
    id: number;
    name: string;
    quantity: number;
    category_ID?: string;
    beneficiary_ID?: string;
    donationRequest_ID?: string ;
    //when we publish we need to update to add the beneficiary_ID and the donationRequest_ID
    
};
enum Status{
  UNAVAILABLE= 'UNAVAILABLE',
  AVAILABLE = 'AVAILABLE',
  PENDING =   'PENDING',
  COMPLETE = 'COMPLETE',
}

interface FormData {
  headline: string;
  description: string;
  images: string[];
  items: Item[];
  tags: { id: number, name: string }[];
  latitude: string;
  longitude: string;
  place_id: string;
  main_location: string;
  secondary_location: string;
  formatted_address: string;
  status: Status;
}

interface PostFormDataResult {
  success: boolean;
  error?: Error;
}

interface FormContextProps {
    formData: FormData;
    updateFormData: (key: keyof FormData, value: any) => void;
    addTag: (tag: { id: number, name: string }) => void;
    removeTag: (tagId: number) => void;
    addItem: (item: Item) => void;
    removeItem: (itemId: number) => void; 
    clearFormData: () => void; // New function for clearing form data
    isFormFilled: boolean; // Boolean to track if form data is filled
    setFormFilled: React.Dispatch<React.SetStateAction<boolean>>; 
    postFormData: () => Promise<PostFormDataResult>;
    uploadImages: (localImages: { base64: string; contentType: string; uri: string }[]) => Promise<void>;

  }

  const FormContext = createContext<FormContextProps | undefined>(undefined);

  interface FormProviderProps {
    children: ReactNode;
  }
  
  export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
      throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
  };


  export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
    const initialFormData: FormData = {
      headline: '',
      description: '',
      images: [],
      items: [],
      tags: [],
      latitude: '',
      longitude: '',
      place_id: '',
      main_location: '',
      secondary_location: '',
      formatted_address: '',
      status: Status.PENDING,
    };
  
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isFormFilled, setFormFilled] = useState(false); // Track whether form is filled
    const {profile}= useAuth();
    useEffect(() => {
      const loadFormData = async () => {
        try {
          // Load formData from AsyncStorage on component mount
          const savedFormDataString = await AsyncStorage.getItem('formData');
          if (savedFormDataString) {
            const savedFormData = JSON.parse(savedFormDataString);
            setFormData(savedFormData);
          }
  
          // Check if formData is filled
          const isFilled =
            formData.headline !== '' &&
            formData.main_location !== '' &&
            formData.latitude !== '' &&
            formData.longitude !== '' &&
            formData.formatted_address !== '' &&
            formData.secondary_location !== '' &&
            formData.items.length > 0; // You can customize this based on your form requirements
          setFormFilled(isFilled);
        } catch (error) {
          console.error('Error loading formData from AsyncStorage:', error);
        }
      };
  
      loadFormData();
    }, []);

    useEffect(() => {
      const saveFormData = async () => {
        try {
          // Save formData to AsyncStorage whenever it changes
          await AsyncStorage.setItem('formData', JSON.stringify(formData));
  
          // Check if formData is filled
          const isFilled =
            formData.headline !== '' &&
           formData.main_location !== '' &&
            formData.latitude !== '' &&
            formData.longitude !== '' &&
            formData.formatted_address !== '' &&
            formData.secondary_location !== '' &&
            formData.items.length > 0; // You can customize this based on your form requirements
          setFormFilled(isFilled);
        } catch (error) {
          console.error('Error saving formData to AsyncStorage:', error);
        }
      };  
  
      saveFormData();
    }, [formData]);

    const fetchPublicUrl = (fileName: string): string | null => {
      const { data } = supabase.storage.from('donationRequestImages').getPublicUrl(fileName);
      if (data === null) {
        console.error('Error fetching public URL:', data);
        return null;
      }
      return data.publicUrl;
    };

  //create image upload function then update urls in formdata.images with the supabase urls and not local urls for posting 
    const uploadImages = async (localImages: { base64: string; contentType: string; uri: string }[]) => {
      const uploadedUrls: string[] = [];

     for (const localImage of localImages){
      const { base64, contentType, uri } = localImage;
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const { data, error } = await supabase.storage.from('donationRequestImages').upload(fileName, decode(localImage.base64),{contentType});
       if (error) {  
          console.error('Error uploading image:', error);
      } 
      const publicUrl = fetchPublicUrl(fileName);
      if (publicUrl) {
        uploadedUrls.push(publicUrl);
      } else {
        console.error('Error retrieving public URL for image:', fileName);
        Alert.alert('Error', 'An error occurred while fetching the image URL. Please try again.');
      }
      console.log(data,'retuned data')
     }
     if (uploadedUrls.length > 0)
     {
     updateFormData('images', [...formData.images, ...uploadedUrls]);
     }
    }

    const updateFormData = (key: keyof FormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  
    const addTag = (tag: { id: number; name: string }) => {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    };
  
    const removeTag = (tagId: number) => {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag.id !== tagId),
      }));
    };
  
    const addItem = (item: Item) => {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }));
    };
  
    const removeItem = (itemId: number) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      }));
    };

    const clearFormData = async () => {
      setFormData(initialFormData); // Reset formData to initial empty state
      setFormFilled(false); // Reset isFormFilled state
      try {
        await AsyncStorage.removeItem('formData'); // Remove saved form data from AsyncStorage
      } catch (error) {
        console.error('Error clearing formData from AsyncStorage:', error);
      }
    };
    const postFormData: () => Promise<PostFormDataResult> = async () => {   
         try {
        //create donationRequest
        updateFormData('status', Status.AVAILABLE);
        console.log(formData,'- - - - posting form data')
        const { data: donationRequest, error:donationRequestError } = await supabase
        .from('donationRequest')
        .insert([
          { headline: formData.headline,
            description: formData.description,
            images: formData.images,
            main_location : formData.main_location,
            secondary_location : formData.secondary_location,
            latitude : formData.latitude,
            longitude : formData.longitude,
            place_id : formData.place_id,
            formatted_address : formData.formatted_address,
            status : formData.status,
            beneficiary_ID: profile?.id ,
            },
        ])
        .select()
        if (donationRequestError) {
          throw donationRequestError;
        }
        //add items
        const donationRequestID = donationRequest[0].id;
        console.log(donationRequestID, 'donationRequestID')
        for (const item of formData.items){
          const {data: itemData, error:itemError}= await supabase.from('item').insert([
            {
              name: item.name,
              quantity: item.quantity,
              category_ID: item.category_ID,
              donationRequest_ID: donationRequestID,
              beneficiary_ID: item.beneficiary_ID,
            }
          ]).select()
          if (itemError) {
            throw itemError;
          }
          const itemID = itemData[0].id;

          if (item.category_ID){
            const {error: itemCategoryError} = await supabase.from('item_categories').insert([
              {
                item_ID: itemID,
                category_ID: item.category_ID
              }
            ])
            if (itemCategoryError){
              throw itemCategoryError;
            }
          }
        }
        for (const tag of formData.tags){
          const {error:tagError}= await supabase.from('donation_request_tags').insert([
            {
              tag_ID: tag.id,
              donationRequest_ID: donationRequestID
            }
          ])
          if (tagError){
            throw tagError;
          } 
        }
       
        
        Alert.alert('Donation Request created successfully');
        clearFormData();
        return {success:true};
    
      }catch (error) {
        console.error('Error posting formData to Supabase:', error);
        return {success: false, error: error as Error}
      }
    }


    return (
      <FormContext.Provider value={{ formData,setFormFilled,isFormFilled, postFormData, updateFormData, addTag,uploadImages, removeTag, clearFormData, addItem, removeItem }}>
        {children}
      </FormContext.Provider>
    );
  };