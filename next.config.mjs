/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };

      // Enhanced rule for handling HTML files
      config.module.rules.push({
        test: /\.html$/,
        loader: "ignore-loader",
        include: /node_modules/,
      });

      // Additional resolve aliases
      config.resolve.alias = {
        ...config.resolve.alias,
        "@mapbox/node-pre-gyp": false,
      };
    }
    return config;
  },
};

export default nextConfig;
