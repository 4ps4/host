(function () {
    "use strict";

    const TRACKING_URL =
        "https://xgzfmoqxbzbxxwhnpbuv.supabase.co/functions/v1/track-visit";

    const SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnemZtb3F4YnpieHh3aG5wYnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODg3MjQsImV4cCI6MjEwNTc2NDcyNH0.Fi8WYHlvM-b0WdfglWyFZeyJ9UKXu1QfUJCaWJRKZDA";

    const VISITOR_KEY = "4ps4_visitor_id";


    // ==========================================
    // VISITOR ID
    // ==========================================

    function getVisitorId() {
        try {
            let id = localStorage.getItem(VISITOR_KEY);

            if (!id) {
                if (
                    typeof crypto !== "undefined" &&
                    typeof crypto.randomUUID === "function"
                ) {
                    id = crypto.randomUUID();
                } else {
                    id =
                        Date.now().toString(36) +
                        Math.random().toString(36).substring(2);
                }

                localStorage.setItem(VISITOR_KEY, id);
            }

            return id;

        } catch (error) {
            return (
                Date.now().toString(36) +
                Math.random().toString(36).substring(2)
            );
        }
    }


    // ==========================================
    // DEVICE
    // ==========================================

    function detectDevice() {
        const ua = navigator.userAgent.toLowerCase();

        if (/ipad|tablet/.test(ua)) {
            return "Tablet";
        }

        if (/mobile|android|iphone|ipod/.test(ua)) {
            return "Mobile";
        }

        return "Desktop";
    }


    // ==========================================
    // BROWSER
    // ==========================================

    function detectBrowser() {
        const ua = navigator.userAgent;

        if (/edg/i.test(ua)) return "Edge";
        if (/opr|opera/i.test(ua)) return "Opera";
        if (/firefox/i.test(ua)) return "Firefox";

        if (/chrome/i.test(ua) && !/edg/i.test(ua)) {
            return "Chrome";
        }

        if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
            return "Safari";
        }

        return "Other";
    }


    // ==========================================
    // OPERATING SYSTEM
    // ==========================================

    function detectOS() {
        const ua = navigator.userAgent;

        if (/Windows NT/i.test(ua)) return "Windows";
        if (/Android/i.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
        if (/Mac OS X/i.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "Other";
    }


    // ==========================================
    // TRACK VISIT
    // ==========================================

    async function trackVisit() {

        console.log("4PS4.PRO tracking started...");


        const visit = {
            page: window.location.pathname,

            referrer:
                document.referrer || null,

            user_agent:
                navigator.userAgent,

            device:
                detectDevice(),

            browser:
                detectBrowser(),

            os:
                detectOS(),

            screen:
                window.screen.width +
                "x" +
                window.screen.height,

            visitor_id:
                getVisitorId()
        };


        console.log(
            "📊 Sending visitor data:",
            visit
        );


        try {

            const response = await fetch(
                TRACKING_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_ANON_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_ANON_KEY
                    },

                    body:
                        JSON.stringify(visit)
                }
            );


            const text =
                await response.text();


            let result;

            try {
                result = JSON.parse(text);
            } catch {
                result = text;
            }


            if (!response.ok) {

                console.error(
                    "❌ Tracking server error:",
                    response.status,
                    result
                );

                return;
            }


            console.log(
                "================================"
            );

            console.log(
                "✅ 4PS4.PRO VISITOR TRACKED"
            );

            console.log(
                "🌍 Country:",
                result.country
            );

            console.log(
                "🏙️ City:",
                result.city
            );

            console.log(
                "📍 Region:",
                result.region
            );

            console.log(
                "================================"
            );


        } catch (error) {

            console.error(
                "❌ Tracking request failed:",
                error
            );

        }
    }


    // ==========================================
    // START
    // ==========================================

    trackVisit();

})();
