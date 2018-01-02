/* eslint-disable import/no-commonjs */

const path = require('path');

module.exports = {
  getProjectRoots() {
    return [__dirname, path.resolve(__dirname, '..', 'src')];
  },
  getProvidesModuleNodeModules() {
    return [
      'hoist-non-react-statics',
      'prop-types',
      'react-native',
      'react-navigation',
      'react',
      'shallowequal',
    ];
  },
};
