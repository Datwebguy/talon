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
      "@farcaster/mini-app-solana": false,
      "@solana/kit": false,
      "@solana-program/memo": false,
      "@solana-program/token": false,
      "@solana-program/system": false,
      "@abstract-foundation/agw-client": false,
    };
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(@x402|@farcaster\/mini-app-solana|@solana|@abstract-foundation)/,
      })
    );
    return config;
  },
};

export default nextConfig;
