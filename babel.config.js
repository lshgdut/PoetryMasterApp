module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['transform-import-meta', { "sourceType": "module" }]
  ]
};