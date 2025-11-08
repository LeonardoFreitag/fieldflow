module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo'], 'nativewind/babel'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './src',
            '@/components/ui': './components/ui',
            '@components': './src/components',
            '@contexts': './src/contexts',
            '@models': './src/models',
            '@hooks': './src/hooks',
            '@store': './src/store',
            '@storage': './src/storage',
            '@routes': './src/routes',
            '@services': './src/services',
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@ui': './components/ui',
            '@dtos': './src/dtos',
            'tailwind.config': './tailwind.config.js'
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
