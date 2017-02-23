/* @flow */

import React, { PureComponent, PropTypes } from 'react';

type State = {
  options: any;
}

export default function enhanceComponent<T: *>(BaseComponent: ReactClass<T>): ReactClass<T> {
  return class extends PureComponent<void, T, State> {
    static displayName = `enhancedComponent(${BaseComponent.displayName || BaseComponent.name})`;

    static contextTypes = {
      handleNavigationUpdates: PropTypes.func,
    };

    state = {
      options: {},
    };

    componentWillMount() {
      this.context.handleNavigationUpdates(options => {
        this.setState({ options });
      });
    }

    render() {
      return (
        <BaseComponent
          __react_navigation_addons_options={this.state.options}
          {...this.props}
        />
      );
    }
  };
}
