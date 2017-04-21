/* eslint-disable import/no-commonjs */

const path = require('path');

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..', 'src')];
  },
  getProvidesModuleNodeModules() {
    return [
      '@expo/vector-icons',
      'hoist-non-react-statics',
      'react-native',
      'react-navigation',
      'react',
      'shallowequal',
    ];
  },
};
