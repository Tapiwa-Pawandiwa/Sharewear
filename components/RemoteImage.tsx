import {Image} from 'react-native';
import React, {ComponentProps, useEffect, useState, useMemo} from 'react';
import { supabase } from '@/lib/supabase';

type RemoteImageProps = {
    path?:string;
    fallback: string;
} & ComponentProps<typeof Image>;

const RemoteImage = ({path, fallback, ...props}: RemoteImageProps) => {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!path) return;
        (async () => {
          setImage('');
          const { data, error } = await supabase.storage.from('donationRequestImages').download(path);
    
          if (error) {
            console.log(error);
          }
    
          if (data) {
            const fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = () => {
              setImage(fr.result as string);
            };
          }
        })();
      }, [path]);

      if (!image) {
      }
      return <Image source={{uri: image || fallback}} {...props} />;
    };

    export default RemoteImage;