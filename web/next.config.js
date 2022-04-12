/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    env: {
        // for testing docker image
        // NEXT_PUBLIC_SERVER_URL: "http://localhost:8080",
        // NEXT_PUBLIC_API_URL: "http://localhost:8080/graphql",

        NEXT_PUBLIC_SERVER_URL: "http://localhost:3000",
        NEXT_PUBLIC_API_URL: "http://localhost:3000/graphql",
    },
};

module.exports = nextConfig;
