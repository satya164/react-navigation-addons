/* @flow */

import React, { PureComponent, PropTypes } from 'react';

export default function enhanceNavigator<T: *>(Navigator: ReactClass<T>): ReactClass<T> {
  return class extends PureComponent<void, T, void> {

    static router = Navigator.router;

    static displayName = `enhancedNavigator(${Navigator.displayName || Navigator.name})`;

    static childContextTypes = {
      handleNavigationUpdates: PropTypes.func,
      updateNavigationComponents: PropTypes.func,
    }

    getChildContext() {
      return {
        updateNavigationComponents: this._updateNavigationComponents,
      };
    }

    _listeners = [];

    _updateNavigationComponents = (options) => {
      this._listeners.forEach(cb => cb(options));
    };

    _handleNavigationUpdates = cb => this._listeners.push(cb);

    render() {
      return <Navigator {...this.props} />;
    }
  };
}
