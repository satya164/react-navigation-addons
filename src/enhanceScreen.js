/* @flow */

import React, { PureComponent } from 'react';

export default function enhanceScreen<T: *>(ScreenComponent: ReactClass<T>): ReactClass<T> {
  class EnhancedScreen extends PureComponent<void, T, void> {
    static displayName = `enhancedScreen(${ScreenComponent.displayName || ScreenComponent.name})`;

    static navigationOptions = ScreenComponent.navigationOptions;

    static childContextTypes = {
      navigation: React.PropTypes.object.isRequired,
    };

    getChildContext() {
      return {
        navigation: this._navigation,
      };
    }

    _previousOptions = ScreenComponent.navigationOptions || {};
    _updateCount = 0;

    _setOptions = (options) => {
      const nextOptions = {};

      for (const option in options) {
        if (typeof options[option] === 'object' && typeof this._previousOptions[option] === 'object') {
          nextOptions[option] = { ...this._previousOptions[option], ...options[option] };
        } else {
          nextOptions[option] = options[option];
        }
      }

      EnhancedScreen.navigationOptions = nextOptions;
      this.props.navigation.setParams({
        __react_navigation_addons_update_count: this._updateCount,
      });
      this._previousOptions = nextOptions;
      this._updateCount++;
    };

    get _navigation() {
      return {
        ...this.props.navigation,
        setOptions: this._setOptions,
      };
    }

    render() {
      return <ScreenComponent {...this.props} navigation={this._navigation} />;
    }
  }

  return EnhancedScreen;
}
