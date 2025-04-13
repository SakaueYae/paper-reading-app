import { supabase } from "@/utils/supabase";
import { FormValues } from "@/components/layout/Form";
import { isAuthError } from "@supabase/supabase-js";

export const signIn = async ({ email, password }: FormValues) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    else return null;
  } catch (e) {
    if (isAuthError(e)) return e.message;
    else return "エラーが発生しました";
  }
};
