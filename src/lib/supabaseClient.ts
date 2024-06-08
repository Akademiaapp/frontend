import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://xkmehhrhrffrmwshluva.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWVoaHJocmZmcm13c2hsdXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MTQzMDksImV4cCI6MjAzMDM5MDMwOX0.ODtSSHGy-7OXqd-VTPG_-7f3yPLK9QVEmNHKeZIt4Bs')