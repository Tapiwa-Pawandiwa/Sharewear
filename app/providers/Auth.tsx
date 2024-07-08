import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  useContext,
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

type AuthData = {
    session: Session | null;
    loading: boolean;
    profile: {
        id: string;
        first_name: string;
        last_name: string;
        user_type: string;
    } | null;
    isAdmin: boolean;
    
};


const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<null | any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<any>(null);
 

  useEffect(() => {
    const fetchSession = async () => {
      const {data:{session}} = await supabase.auth.getSession();
      setSession(session);
      
      if(session){
        const {data, error, status} = await supabase.from('profiles').select('id,first_name,last_name,user_type').eq('id', session?.user.id).single();
       setProfile(data || null);
      }
      setLoading(false); 
    };
    fetchSession();
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    }
    );
  }
  , []);

 

  return <AuthContext.Provider value={{session, profile,loading,isAdmin: profile?.user_type==='Beneficiary'}}>{children}</AuthContext.Provider>;
}


export const useAuth = () => useContext(AuthContext);