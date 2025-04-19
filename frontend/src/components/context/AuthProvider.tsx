import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
        // error,
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
      // TODO:エラー画面実装
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoading(true);
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
