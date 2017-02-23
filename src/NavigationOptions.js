/* @flow */

import { PureComponent, PropTypes } from 'react';
import type { NavigationScreenOptions } from 'react-navigation/src/TypeDefinition';

export default class NavigationOptions extends PureComponent<void, NavigationScreenOptions, void> {
  static contextTypes = {
    onNavigationOptionsChange: PropTypes.func,
  }

  componentWillMount() {
    this.context.onNavigationOptionsChange(this.props);
  }

  componentWillReceiveProps(nextProps: NavigationScreenOptions) {
    this.context.onNavigationOptionsChange(nextProps);
  }

  render() {
    return null;
  }
}
