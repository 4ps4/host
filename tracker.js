const SUPABASE_URL = "https://xgzfmoqxbzbxxwhnpbuv.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnemZtb3F4YnpieHh3aG5wYnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODg3MjQsImV4cCI6MjEwNTc2NDcyNH0.Fi8WYHlvM-b0WdfglWyFZeyJ9UKXu1QfUJCaWJRKZDA";

async function trackVisit() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/visits`,
            {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    page: window.location.pathname,
                    referrer: document.referrer || null,
                    user_agent: navigator.userAgent
                })
            }
        );

        if (!response.ok) {
            console.error("Tracking failed:", await response.text());
        }
    } catch (error) {
        console.error("Tracking error:", error);
    }
}

trackVisit();
