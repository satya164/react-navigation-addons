/* @flow */

import React, { PureComponent, PropTypes } from 'react';

export default function enhanceScreen<T: *>(ScreenComponent: ReactClass<T>): ReactClass<T> {
  class EnhancedScreen extends PureComponent<void, T, void> {
    static navigationOptions = ScreenComponent.navigationOptions;

    static displayName = `enhancedScreen(${ScreenComponent.displayName || ScreenComponent.name})`;

    static contextTypes = {
      onNavigationOptionsChange: PropTypes.func,
    }

    _previousOptions = ScreenComponent.navigationOptions;

    _setOptions = options => {
      const nextOptions = { ...this._previousOptions, ...options };
      EnhancedScreen.navigationOptions = nextOptions;
      this.context.onNavigationOptionsChange(nextOptions);
      this._previousOptions = nextOptions;
    };

    render() {
      const navigation = {
        ...this.props.navigation,
        setOptions: this._setOptions,
      };
      return <ScreenComponent {...this.props} navigation={navigation} />;
    }
  }

  return EnhancedScreen;
}
