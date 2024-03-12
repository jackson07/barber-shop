/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "utfs.io",
        },
        {
            hostname: "ycpkhyzcnblfqrthjsys.supabase.co",
        },
    ]
    }
};

export default nextConfig;
