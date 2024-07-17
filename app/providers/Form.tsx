import React,{createContext, useContext,useEffect, useState,ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from './Auth';
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
  city: string;
  suburb: string;
  status: Status;
  
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
    postFormData: () => Promise<void>;

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
      city: '',
      suburb: '',
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
            formData.city !== '' &&
            formData.suburb !== '' &&
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
            formData.city !== '' &&
            formData.suburb !== '' &&
            formData.items.length > 0; // You can customize this based on your form requirements
          setFormFilled(isFilled);
        } catch (error) {
          console.error('Error saving formData to AsyncStorage:', error);
        }
      };
  
      saveFormData();
    }, [formData]);
  //create image upload function then update urls in formdata.images with the supabase urls and not local urls for posting 

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
    const postFormData = async ()=> {
      try {
        const { data: donationRequest, error:donationRequestError } = await supabase
        .from('donationRequest')
        .insert([
          { headline: formData.headline,
            description: formData.description,
            images: formData.images,
            city : formData.city,
            suburb : formData.suburb,
            status : formData.status,
            beneficiary_ID: profile?.id ,
            },
        ])
        .select()
        if (donationRequestError) {
          throw donationRequestError;
        }

        const donationRequestID = donationRequest[0].id;
        console.log(donationRequestID, 'donationRequestID')
        

      }catch (error) {
        console.error('Error posting formData to Supabase:', error);
      }
    }


    return (
      <FormContext.Provider value={{ formData,setFormFilled,isFormFilled, postFormData, updateFormData, addTag, removeTag, clearFormData, addItem, removeItem }}>
        {children}
      </FormContext.Provider>
    );
  };