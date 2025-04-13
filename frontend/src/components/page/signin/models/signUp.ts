import { supabase } from "@/utils/supabase";
import { FormValues } from "@/components/layout/Form";
import { AuthError } from "@supabase/supabase-js";

export const signUp = async ({ email, password }: FormValues) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: import.meta.env.ROOT,
      },
    });

    if (error) throw new Error(error.message);
    else return null;
  } catch (e) {
    if (e instanceof AuthError) return e.message;
    else return "エラーが発生しました";
  }
};
