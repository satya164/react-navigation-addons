/* @flow */

import React, { PureComponent, PropTypes } from 'react';
import type {
  NavigationState,
} from 'react-navigation/src/TypeDefinition';

type NavigationStateListener = NavigationState => void

export default function enhanceNavigator<T: *>(Navigator: ReactClass<T>): ReactClass<T> {
  return class extends PureComponent<void, T, void> {

    static router = Navigator.router;

    static displayName = `enhancedNavigator(${Navigator.displayName || Navigator.name})`;

    static childContextTypes = {
      getNavigationState: PropTypes.func,
      addNavigationStateChangeListener: PropTypes.func,
      removeNavigationStateChangeListener: PropTypes.func,
    };

    getChildContext() {
      return {
        getNavigationState: PropTypes.func,
        addNavigationStateChangeListener: this._addNavigationStateChangeListener,
        removeNavigationStateChangeListener: this._removeNavigationStateChangeListener,
      };
    }

    _navigationState = null;
    _listeners: Array<NavigationStateListener> = [];

    _getNavigationState = () => this._navigationState;

    _addNavigationStateChangeListener = (cb: NavigationStateListener) => {
      this._listeners.push(cb);
    };

    _removeNavigationStateChangeListener = (cb: NavigationStateListener) => {
      this._listeners = this._listeners.filter(c => c !== cb);
    };

    _handleNavigationStateChange = (prevState, currState) => {
      this._navigationState = currState;
      this._listeners.forEach(cb => cb(currState));

      if (typeof this.props.onNavigationStateChange !== 'undefined') {
        this.props.onNavigationStateChange(prevState, currState);
      }
    };

    render() {
      return (
        <Navigator
          {...this.props}
          onNavigationStateChange={this._handleNavigationStateChange}
        />
      );
    }
  };
}
