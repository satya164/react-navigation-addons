/* @flow */

import React, { PureComponent, PropTypes } from 'react';

export default function enhanceNavigator<T: *>(Navigator: ReactClass<T>): ReactClass<T> {
  class EnhancedNavigator extends PureComponent<void, T, void> {

    static router = Navigator.router;

    static displayName = `enhancedNavigator(${Navigator.displayName || Navigator.name})`;

    static childContextTypes = {
      onNavigationOptionsChange: PropTypes.func,
    }

    getChildContext() {
      return {
        onNavigationOptionsChange: this._handleNavigationOptionsChange,
      };
    }

    _handleNavigationOptionsChange = () => {
      // TODO
    };

    render() {
      return <Navigator {...this.props} />;
    }
  }

  return EnhancedNavigator;
}
