/* @flow */

import EventEmitter from 'events'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist from 'hoist-non-react-statics';
import shallowEqual from 'shallowequal';
import { NavigationActions } from 'react-navigation';

import type {
  NavigationState,
  NavigationAction,
  NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition';

type ListenerName = 'focus' | 'blur' | 'change';
type Listener = () => void;

type Context = {
  getParentNavigation: () => NavigationScreenProp<
    NavigationState,
    NavigationAction
    >,
  addNavigationStateChangeListener: ((NavigationState) => void) => void,
  removeNavigationStateChangeListener: ((NavigationState) => void) => void,
};

const screens = [];

const COUNT_PARAM = '__react_navigation_addons_update_count';

const eventEmitter = new EventEmitter();

export default function enhanceScreen<T: *>(
  ScreenComponent: ReactClass<T>,
): ReactClass<T> {
  class EnhancedScreen extends Component<void, T, void> {
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
      screens.push(this.props.navigation)
      eventEmitter.on('forceUpdate', this._forceUpdate)
    }

    componentDidMount() {
      this.context.addNavigationStateChangeListener(
        this._handleNavigationStateChange,
      );
    }

    shouldComponentUpdate(nextProps) {
      const { state } = this.props.navigation;
      const { state: nextState } = nextProps.navigation;

      // This is a result of a previous `setOptions` call, prevent extra render
      if (state.params) {
        if (
          nextState.params &&
          nextState.params[COUNT_PARAM] === state.params[COUNT_PARAM] + 1
        ) {
          return false;
        }
      }

      return (
        !shallowEqual(this.props, nextProps) ||
        !shallowEqual(this.state, nextState)
      );
    }

    componentWillUnmount() {
      this.context.removeNavigationStateChangeListener(
        this._handleNavigationStateChange,
      );
      screens.splice(screens.findIndex((item) => item.state.key === this.props.navigation.state.key), 1);
      eventEmitter.removeListener('forceUpdate', this._forceUpdate)
    }

    context: Context;

    _previousOptions = ScreenComponent.navigationOptions || {};
    _updateCount = 0;
    _listeners: { [key: ListenerName]: Array<Listener> } = {};
    _focused: boolean = false;

    _setOptions = options => {
      let nextOptions;

      if (
        typeof this._previousOptions === 'object' &&
        typeof options === 'object'
      ) {
        nextOptions = { ...this._previousOptions, ...options };
      } else {
        nextOptions = options;
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

      this._listeners[name] = this._listeners[name].filter(
        cb => cb !== callback,
      );
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

    /**
     * Rewrite the goback
     * @param params {String|Number} routeName or steps
     * @private
     */
    _goBack = params => {
      const max = screens.length - 1;
      if (typeof params === 'string') {
        const index = screens.findIndex((item) => item.state.routeName === params);
        if (~index) {
          for (let i = max; i > index; i--) {
            screens[i].goBack();
          }
        } else {
          this.props.navigation.dispatch(NavigationActions.reset({ index: 0, actions: [{ routeName: params,}] }));
        }
      } else if (typeof params === 'number') {
        const index = Math.max(0, max - params);
        for (let i = max; i > index; i--) {
          screens[i].goBack();
        }
      } else {
        this.props.navigation.goBack(params);
      }
    };

    _forceUpdate = () => {
      this.forceUpdate()
    };

    get _navigation() {
      return {
        ...this.props.navigation,
        setOptions: this._setOptions,
        getParent: this._getParent,
        addListener: this._addListener,
        removeListener: this._removeListener,
        goBack: this._goBack,
        forceUpdate: ()=> eventEmitter.emit('forceUpdate')
      };
    }

    render() {
      return <ScreenComponent {...this.props} navigation={this._navigation} />;
    }
  }

  hoist(ScreenComponent, EnhancedScreen);

  return EnhancedScreen;
}
