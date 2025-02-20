module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@services': './src/services',
            '@assets': './src/assets',
            '@config': './src/config',
            '@redux': './src/redux',
            '@constants': './src/constants',
            '@storage': './src/storage',
            '@theme': './src/theme',
            '@contexts': './src/contexts',
            '@hooks': './src/hooks',
            '@dtos': './src/dtos',
            '@models': './src/models',
            '@store': './src/store',
          },
        },
        'react-native-reanimated/plugin',
      ],
    ],
  };
};
