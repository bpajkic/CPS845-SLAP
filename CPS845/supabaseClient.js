import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://iymtqfvemlkysjgrwdnf.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bXRxZnZlbWxreXNqZ3J3ZG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyOTY5MDUsImV4cCI6MjA0NTg3MjkwNX0.3xcVHvxZW_zyyETLTrp66qTH9fQW2Nm7ha0MabR30wI"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase