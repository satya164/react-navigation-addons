/* @flow */

import React, { PureComponent, PropTypes } from 'react';
import type {
  NavigationState,
} from 'react-navigation/src/TypeDefinition';

type ListenerName = 'focus' | 'blur'
type Listener = () => void

type Context = {
  getNavigationState: () => NavigationState;
  addNavigationStateChangeListener: (NavigationState => void) => void;
  removeNavigationStateChangeListener: (NavigationState => void) => void;
}

export default function enhanceScreen<T: *>(ScreenComponent: ReactClass<T>): ReactClass<T> {
  return class EnhancedScreen extends PureComponent<void, T, void> {
    static displayName = `enhancedScreen(${ScreenComponent.displayName || ScreenComponent.name})`;

    static navigationOptions = ScreenComponent.navigationOptions;

    static contextTypes = {
      getNavigationState: PropTypes.func,
      addNavigationStateChangeListener: PropTypes.func,
      removeNavigationStateChangeListener: PropTypes.func,
    };

    static childContextTypes = {
      navigation: PropTypes.object,
    };

    getChildContext() {
      return {
        navigation: this._navigation,
      };
    }

    componentDidMount() {
      this.context.addNavigationStateChangeListener(this._handleNavigationStateChange);
    }

    componentWillUnmount() {
      this.context.removeNavigationStateChangeListener(this._handleNavigationStateChange);
    }

    context: Context;

    _previousOptions = ScreenComponent.navigationOptions || {};
    _updateCount = 0;
    _listeners: { [key: ListenerName]: Array<Listener> };
    _focused: boolean = false;

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

    _addListener = (name: ListenerName, callback: Listener) => {
      if (!this._listeners[name]) {
        this._listeners[name] = [];
      }

      this._listeners[name].push(callback);
    };

    _removeListener = (name: ListenerName, callback: Listener) => {
      if (!this._listeners[name]) {
        return;
      }

      this._listeners[name] = this._listeners[name].filter(cb => cb !== callback);
    };

    _handleNavigationStateChange = state => {
      const focused = state.routes[state.index] === this.props.navigation.state;

      if (this._listeners.focus && focused) {
        this._listeners.focus.forEach(cb => cb());
      }

      if (this._listeners.blur && !focused) {
        this._listeners.blur.forEach(cb => cb());
      }
    };

    _isFocused = () => {
      const state = this.context.getNavigationState();
      return state ? state.routes[state.index] === this.props.navigation.state : false;
    };

    get _navigation() {
      return {
        ...this.props.navigation,
        setOptions: this._setOptions,
        addListener: this._addListener,
        removeListener: this._removeListener,
        isFocused: this._isFocused,
      };
    }

    render() {
      return <ScreenComponent {...this.props} navigation={this._navigation} />;
    }
  };
}
