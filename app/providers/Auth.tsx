import { supabase } from "@/lib/supabase";
import { Callback } from "@react-native-async-storage/async-storage/lib/typescript/types";
import { Session, User } from "@supabase/supabase-js";
import { router } from "expo-router";
import {
  useContext,
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";


WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();


const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};



type AuthData = {
    session: Session | null;
    loading: boolean;
    profile: {
        id: string;
        first_name: string;
        last_name: string;
        user_type: string;
        phone_number: string;
        email: string;
    } | null;
    isAdmin: boolean;
    signUserOut: () => Promise<void>;
    user: User | null;
    loginWithToken: (
      credentials: Tokens,
      options?: { redirectTo?: string }
    ) => Promise<void>;
};




type Tokens = {
  access_token: string;
  refresh_token: string;
}

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    signUserOut: async () => {},
    isAdmin: false,
    user: null,
    loginWithToken: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<null | any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<any>(null);
    const [user,setUser]= useState<User | null>(null);


    const loginWithToken = async ({ access_token, refresh_token }: Tokens) => {
      const signIn = async () => {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
  
        return await supabase.auth.refreshSession();
      };
  
      const {
        data: { user: supabaseUser },
      } = await signIn();
      console.log(supabaseUser);
      setUser(supabaseUser);
      setProfile(supabaseUser);
    };
    
  
    const signUserOut = async () => {
      try {
        console.log('Sign out');
        await supabase.auth.signOut();
        setProfile(null); // Clear profile state
        setSession(null); // Clear session state
        setUser(null);    // Clear user state
        router.replace('/(auth)/sign-in');
      } catch (e: any) {
        console.log('Sign out failed', e);
      }
    }

    const fetchProfile = async (session: Session | null) => {
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id,first_name,last_name,user_type,phone_number,email')
          .eq('id', session?.user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        }
        setProfile(data || null);
      } else {
        setProfile(null);
      }
    };
    
    useEffect(() => {
      const fetchSession = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
  
        // Fetch profile if session exists
        await fetchProfile(session);
  
        setLoading(false);
      };
  
      fetchSession();
  
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        setUser(session?.user || null);
  
        // Fetch profile on session change
        fetchProfile(session);
      });
  
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }, []);

 

  return <AuthContext.Provider value={{session,user,signUserOut, loginWithToken, profile,loading,isAdmin: profile?.user_type==='Beneficiary'}}>{children}</AuthContext.Provider>;
}


export const useAuth = () => useContext(AuthContext);