/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import hoist from 'hoist-non-react-statics';
import type { NavigationState } from 'react-navigation/src/TypeDefinition';

type NavigationStateListener = NavigationState => void;

export default function enhanceNavigator<T: *>(
  Navigator: ReactClass<T>,
): ReactClass<T> {
  class EnhancedNavigator extends PureComponent<void, T, void> {
    static displayName = `enhancedNavigator(${Navigator.displayName ||
      Navigator.name})`;

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
      let props = this.props;

      if (!this.props.navigation || !this.props.navigation.state) {
        props = {
          ...props,
          onNavigationStateChange: this._handleNavigationStateChange,
        };
      }

      return <Navigator {...props} />;
    }
  }

  hoist(Navigator, EnhancedNavigator);

  return EnhancedNavigator;
}
