import { clientEnvs } from "@/env/client";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = clientEnvs.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = clientEnvs.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
