import { supabase } from "@/utils/supabase";
import { FormValues } from "@/components/layout/Form";
import { AuthError } from "@supabase/supabase-js";

export const signIn = async ({ email, password }: FormValues) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return error.message;
    else return null;
  } catch (e) {
    if (e instanceof AuthError) return e.message;
    else return "エラーが発生しました";
  }
};
