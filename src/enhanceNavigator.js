/* @flow */

import React, { PureComponent } from 'react';

export default function enhanceNavigator<T: *>(Navigator: ReactClass<T>): ReactClass<T> {
  class EnhancedNavigator extends PureComponent<void, T, void> {

    static router = Navigator.router;

    static displayName = `enhancedNavigator(${Navigator.displayName || Navigator.name})`;

    render() {
      return <Navigator {...this.props} />;
    }
  }

  return EnhancedNavigator;
}
