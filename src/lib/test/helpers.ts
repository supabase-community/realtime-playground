import type { SupabaseClient } from "@supabase/supabase-js";

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const waitFor = (cond: () => boolean, timeout = 5000, retryDelay = 200) => {
  return new Promise<void>(async (resolve, reject) => {
    setTimeout(() => {
      reject({message: "timeout"});
    }, timeout)

    while (true) {
      if (cond()) {
        resolve()
        return
      } else {
        await sleep(retryDelay);
      }
    }
  })
}

export async function signInUser(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(`Error signing in: ${error.message}`);
  return data!.session!.access_token;
}
