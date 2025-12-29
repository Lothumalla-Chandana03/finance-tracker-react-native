// Export a function to configure Babel
module.exports = function (api) {
  api.cache(true); // Cache the Babel config for faster rebuilds

  return {
    presets: ["babel-preset-expo"], // Use Expo's default Babel preset for React Native projects
  };
};
