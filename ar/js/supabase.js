import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://fcqipywftqggkjoofqrf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcWlweXdmdHFnZ2tqb29mcXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0OTg4NjAsImV4cCI6MjA2MjA3NDg2MH0.ubn2-1sSLPoJ9PR0tLlFaX8KRVGBuUq9HWIDYJWk-z8'
const supabase = createClient(supabaseUrl, supabaseKey)

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
let visitorId = localStorage.getItem('visitorId');

if (!visitorId) {
  visitorId = crypto.randomUUID();
  localStorage.setItem('visitorId', visitorId);
}

async function trackVisit() {
  const { data, error } = await supabase
    .from('visits')
    .select('last_visit')
    .eq('visitor_id', visitorId)
    .single();

  const now = new Date();

  if (error && error.code === 'PGRST116') {
    // زائر جديد تمامًا → أضف أول زيارة وزد العداد
    await supabase.from('visits').insert({
      visitor_id: visitorId,
      last_visit: now.toISOString()
    });

    await incrementCounter();

  } else if (!error && data) {
    const lastVisit = new Date(data.last_visit);
    const diff = now - lastVisit;

    if (diff > ONE_DAY_MS) {
      // زائر قديم، ولكن مر يوم → نحدث الوقت ونزيد العداد
      await supabase
        .from('visits')
        .update({ last_visit: now.toISOString() })
        .eq('visitor_id', visitorId);

      await incrementCounter();
    }
  }
}

async function incrementCounter() {
  await supabase
    .from('visitors')
    .update({ visits: supabase.raw('visits + 1') })
    .eq('id', 1);
}

// استدعِ هذا عند تحميل الصفحة
trackVisit();
