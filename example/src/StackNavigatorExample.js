/* @flow */

import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { StackNavigator, CardStack } from 'react-navigation';
import { enhance, NavigationOptions } from 'react-navigation-addons';

class HomeScreen extends PureComponent {
  state = {
    title: 'Hello world',
  };

  componentDidMount() {
    let i = 0;
    setInterval(() => {
      this.setState({
        title: `Hello world ${i}`,
      });
      i++;
    }, 1000);
  }

  render() {
    return (
      <View>
        <NavigationOptions
          header={{
            title: this.state.title,
          }}
        />
        <Text>Hello</Text>
      </View>
    );
  }
}

const Stacks = enhance(StackNavigator)({
  Home: { screen: HomeScreen },
}, {
  headerComponent: CardStack.Header,
});

export default class StackNavigatorExample extends PureComponent {
  render() {
    return <Stacks />;
  }
}
