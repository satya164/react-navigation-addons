/* @flow */

import React, { PureComponent } from 'react';

export default function enhanceScreen<T: *>(ScreenComponent: ReactClass<T>): ReactClass<T> {
  class EnhancedScreen extends PureComponent<void, T, void> {
    static navigationOptions = ScreenComponent.navigationOptions;

    static displayName = `enhancedScreen(${ScreenComponent.displayName || ScreenComponent.name})`;

    _previousOptions = ScreenComponent.navigationOptions || {};

    _updateCount = 0;

    _setOptions = (options) => {
      const nextOptions = {};

      for (const option in options) {
        nextOptions[option] = { ...this._previousOptions[option], ...options[option] };
      }

      EnhancedScreen.navigationOptions = nextOptions;
      this.props.navigation.setParams({
        __react_navigation_addons_update_count: this._updateCount,
      });
      this._previousOptions = nextOptions;
      this._updateCount++;
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
