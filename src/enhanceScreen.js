/* @flow */

import React, { PureComponent, PropTypes } from 'react';

export default function enhanceScreen<T: *>(ScreenComponent: ReactClass<T>): ReactClass<T> {
  class EnhancedScreen extends PureComponent<void, T, void> {
    static navigationOptions = ScreenComponent.navigationOptions;

    static displayName = `enhancedScreen(${ScreenComponent.displayName || ScreenComponent.name})`;

    static contextTypes = {
      updateNavigationComponents: PropTypes.func,
    }

    static childContextTypes = {
      onNavigationOptionsChange: PropTypes.func,
    }

    getChildContext() {
      return {
        onNavigationOptionsChange: this._handleNavigationOptionsChange,
      };
    }

    _handleNavigationOptionsChange = options => {
      const nextOptions = { ...ScreenComponent.navigationOptions, ...options };
      EnhancedScreen.navigationOptions = nextOptions;
      this.context.updateNavigationComponents(nextOptions);
    };

    render() {
      return <ScreenComponent {...this.props} />;
    }
  }

  return EnhancedScreen;
}
