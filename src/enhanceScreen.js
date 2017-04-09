/* @flow */

import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import type {
  NavigationState,
  NavigationAction,
  NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';

type ListenerName = 'focus' | 'blur' | 'change'
type Listener = () => void

type Context = {
  getParentNavigation: () => NavigationScreenProp<NavigationState, NavigationAction>;
  addNavigationStateChangeListener: (NavigationState => void) => void;
  removeNavigationStateChangeListener: (NavigationState => void) => void;
}

const COUNT_PARAM = '__react_navigation_addons_update_count';

export default function enhanceScreen<T: *>(ScreenComponent: ReactClass<T>): ReactClass<T> {
  return class EnhancedScreen extends Component<void, T, void> {
    static displayName = `enhancedScreen(${ScreenComponent.displayName || ScreenComponent.name})`;

    static navigationOptions = ScreenComponent.navigationOptions;

    static contextTypes = {
      getParentNavigation: PropTypes.func,
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

    componentWillMount() {
      this.props.navigation.setParams({ [COUNT_PARAM]: this._updateCount });
    }

    componentDidMount() {
      this.context.addNavigationStateChangeListener(this._handleNavigationStateChange);
    }

    shouldComponentUpdate(nextProps) {
      const { state } = this.props.navigation;
      const { state: nextState } = nextProps.navigation;

      // This is a result of a previous `setOptions` call, prevent extra render
      if (state.params) {
        if (nextState.params && nextState.params[COUNT_PARAM] === state.params[COUNT_PARAM] + 1) {
          return false;
        }
      }

      return shallowCompare(this, nextProps, nextState);
    }

    componentWillUnmount() {
      this.context.removeNavigationStateChangeListener(this._handleNavigationStateChange);
    }

    context: Context;

    _previousOptions = ScreenComponent.navigationOptions || {};
    _updateCount = 0;
    _listeners: { [key: ListenerName]: Array<Listener> } = {};
    _focused: boolean = false;

    _isPlainObject = o => {
      return typeof o === 'object' && (o.constructor === Object || typeof o.constructor === 'undefined');
    };

    _setOptions = (name, options) => {
      const nextOptions = { ...this._previousOptions };

      if (this._isPlainObject(options) && this._isPlainObject(this._previousOptions[name])) {
        nextOptions[name] = { ...this._previousOptions[name], ...options };
      } else {
        nextOptions[name] = options;
      }

      EnhancedScreen.navigationOptions = nextOptions;
      this.props.navigation.setParams({ [COUNT_PARAM]: this._updateCount });
      this._previousOptions = nextOptions;
      this._updateCount++;
    };

    _getParent = () => this.context.getParentNavigation();

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

      if (this._listeners.change) {
        this._listeners.change.forEach(cb => cb(state));
      }

      if (this._listeners.focus && focused) {
        this._listeners.focus.forEach(cb => cb());
      }

      if (this._listeners.blur && !focused) {
        this._listeners.blur.forEach(cb => cb());
      }
    };

    get _navigation() {
      return {
        ...this.props.navigation,
        setOptions: this._setOptions,
        getParent: this._getParent,
        addListener: this._addListener,
        removeListener: this._removeListener,
      };
    }

    render() {
      return <ScreenComponent {...this.props} navigation={this._navigation} />;
    }
  };
}
