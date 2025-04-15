import { supabase } from "@/utils/supabase";

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return error;
};
