import { createClient } from '@supabase/supabase-js'


const url = "https://aicvmomgvfysoombpdkz.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpY3Ztb21ndmZ5c29vbWJwZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxNjY3MzgsImV4cCI6MjAxMTc0MjczOH0.e9HamizPtXDJoBxHuRE4Gz1TP6PP7pf9DscZjZbayyo"

export const supabase = createClient(
  url,
  key
)

