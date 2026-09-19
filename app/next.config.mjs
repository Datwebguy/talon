/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
    };
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@x402/,
      })
    );
    return config;
  },
};

export default nextConfig;
