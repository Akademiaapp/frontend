import { createClient } from '@supabase/supabase-js';
import type { Database } from '../supabase.types';

import type { svelteSupabase } from './supaStore';
export const supabase = createClient<Database>(
	'https://khpnlpgmzmocwqjkvemv.this.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
) as svelteSupabase<Database>;

const documents = supabase.store('document');

documents.delete(1);

documents.getData()?.[0].isNote;
