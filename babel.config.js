module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  // 添加 plugins
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-transform-optional-chaining',
  ],
};
