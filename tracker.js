(function () {
    "use strict";

    const SUPABASE_URL =
        "https://xgzfmoqxbzbxxwhnpbuv.supabase.co";

    const SUPABASE_ANON_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnemZtb3F4YnpieHh3aG5wYnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODg3MjQsImV4cCI6MjEwNTc2NDcyNH0.Fi8WYHlvM-b0WdfglWyFZeyJ9UKXu1QfUJCaWJRKZDA";

    const VISITOR_KEY = "4ps4_visitor_id";


    // ==========================================
    // GET / CREATE VISITOR ID
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

        if (/edg/i.test(ua)) {
            return "Edge";
        }

        if (/opr|opera/i.test(ua)) {
            return "Opera";
        }

        if (/firefox/i.test(ua)) {
            return "Firefox";
        }

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

        if (/Windows NT/i.test(ua)) {
            return "Windows";
        }

        if (/Android/i.test(ua)) {
            return "Android";
        }

        if (/iPhone|iPad|iPod/i.test(ua)) {
            return "iOS";
        }

        if (/Mac OS X/i.test(ua)) {
            return "macOS";
        }

        if (/Linux/i.test(ua)) {
            return "Linux";
        }

        return "Other";
    }


    // ==========================================
    // GET COUNTRY / CITY / REGION
    // ==========================================

    async function getLocation() {

        try {

            const response = await fetch(
                "https://ipapi.co/json/",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Location API returned HTTP " +
                    response.status
                );

            }


            const data = await response.json();


            console.log(
                "🌍 Location data received:",
                data
            );


            return {

                country:
                    data.country_name ||
                    data.country ||
                    "Unknown",

                city:
                    data.city ||
                    "Unknown",

                region:
                    data.region ||
                    data.region_code ||
                    "Unknown"

            };


        } catch (error) {

            console.error(
                "🌍 Location lookup failed:",
                error
            );


            return {

                country: "Unknown",

                city: "Unknown",

                region: "Unknown"

            };

        }

    }


    // ==========================================
    // TRACK VISIT
    // ==========================================

    async function trackVisit() {

        console.log(
            "4PS4.PRO tracking started..."
        );


        try {


            // Get visitor location

            const location =
                await getLocation();


            // Create visit object

            const visit = {

                page:
                    window.location.pathname,

                referrer:
                    document.referrer ||
                    null,

                user_agent:
                    navigator.userAgent,

                country:
                    location.country,

                city:
                    location.city,

                region:
                    location.region,

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


            // Send to Supabase

            const response =
                await fetch(

                    SUPABASE_URL +
                    "/rest/v1/visits",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_ANON_KEY,

                            "Authorization":
                                "Bearer " +
                                SUPABASE_ANON_KEY,

                            "Prefer":
                                "return=minimal"

                        },

                        body:
                            JSON.stringify(visit)

                    }

                );


            // Check response

            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "================================"
                );

                console.error(
                    "SUPABASE TRACKING ERROR"
                );

                console.error(
                    "Status:",
                    response.status
                );

                console.error(
                    "Message:",
                    errorText
                );

                console.error(
                    "================================"
                );

                return;

            }


            console.log(
                "✅ 4PS4.PRO VISITOR TRACKED"
            );


            console.log(
                "🌍 Country:",
                visit.country
            );


            console.log(
                "🏙️ City:",
                visit.city
            );


        } catch (error) {

            console.error(
                "❌ Visitor tracking failed:",
                error
            );

        }

    }


    // ==========================================
    // START TRACKING
    // ==========================================

    trackVisit();

})();
