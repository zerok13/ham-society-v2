/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  allowedDevOrigins: [
    "*.preview.same-app.com",
    "*.sandbox.novita.ai",
  ],
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "same-assets.com",
      "assets.same.dev",
      "xrvbwnfntfdvarvqpqcq.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.same.dev",
        pathname: "/**",
      },
      // Supabase Storage (signed URLs)
      {
        protocol: "https",
        hostname: "xrvbwnfntfdvarvqpqcq.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

module.exports = nextConfig;
