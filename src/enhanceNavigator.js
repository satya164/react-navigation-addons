/* @flow */

import React, { PureComponent, PropTypes } from 'react';
import type { NavigationState } from 'react-navigation/src/TypeDefinition';

type NavigationStateListener = NavigationState => void;

export default function enhanceNavigator<T: *>(
  Navigator: ReactClass<T>,
): ReactClass<T> {
  return class extends PureComponent<void, T, void> {
    static router = Navigator.router;
    static displayName = `enhancedNavigator(${Navigator.displayName || Navigator.name})`;

    static childContextTypes = {
      getParentNavigation: PropTypes.func,
      addNavigationStateChangeListener: PropTypes.func,
      removeNavigationStateChangeListener: PropTypes.func,
    };

    getChildContext() {
      return {
        getParentNavigation: this._getParentNavigation,
        addNavigationStateChangeListener: this
          ._addNavigationStateChangeListener,
        removeNavigationStateChangeListener: this
          ._removeNavigationStateChangeListener,
      };
    }

    componentDidUpdate(prevProps: T) {
      if (
        prevProps.navigation &&
        this.props.navigation &&
        prevProps.navigation.state !== this.props.navigation.state
      ) {
        this._fireStateListeners(this.props.navigation.state);
      }
    }

    _listeners: Array<NavigationStateListener> = [];

    _getParentNavigation = () => this.props.navigation;

    _addNavigationStateChangeListener = (cb: NavigationStateListener) => {
      this._listeners.push(cb);
    };

    _removeNavigationStateChangeListener = (cb: NavigationStateListener) => {
      this._listeners = this._listeners.filter(c => c !== cb);
    };

    _handleNavigationStateChange = (prevState, currState, action) => {
      this._fireStateListeners(currState);

      if (typeof this.props.onNavigationStateChange !== 'undefined') {
        this.props.onNavigationStateChange(prevState, currState, action);
      }
    };

    _fireStateListeners = state => this._listeners.forEach(cb => cb(state));

    render() {
      let topLevelNavProps;
      // We can only set onNavigationStateChange on top level navigators
      // with react-navigation v1.0.0-beta.9 otherwise we get an exception
      if (!this.props.navigation || !this.props.navigation.state) {
        topLevelNavProps = { onNavigationStateChange: this._handleNavigationStateChange}
      }

      return (
        <Navigator
          {...this.props}
          {...topLevelNavProps}
        />
      );
    }
  };
}
