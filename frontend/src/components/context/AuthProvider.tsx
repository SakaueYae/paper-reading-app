import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, type User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  accessToken: null,
  refreshToken: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
});

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
        // error,
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setRefreshToken(session?.refresh_token ?? null);
      setIsLoading(false);
      // TODO:エラー画面実装
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAccessToken(session?.access_token ?? null);
      setRefreshToken(session?.refresh_token ?? null);
      setIsLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // サインイン
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  // サインアウト
  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  // サインアップ
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setIsLoading(false);
      throw error;
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        accessToken,
        refreshToken,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
