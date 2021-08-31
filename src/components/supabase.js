import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zrtmopobafsmopzseepi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNTcyNzIwNiwiZXhwIjoxOTMxMzAzMjA2fQ.uHN5iCgG74oQxhesjDQxLGuFyOvAxAO09d29IjuDCmU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
