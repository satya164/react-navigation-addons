/* @flow */

import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { StackNavigator, CardStack } from 'react-navigation';
import { enhance } from 'react-navigation-addons';

class HomeScreen extends PureComponent {
  state = {
    title: 'Hello world',
  };

  componentWillMount() {
    this.props.navigation.setOptions({
      title: 'Hello world',
    });
  }

  componentDidMount() {
    let i = 0;
    setInterval(() => {
      this.props.navigation.setOptions({
        title: `Hello world ${i}`,
      });
      i++;
    }, 1000);
  }

  render() {
    return (
      <View>
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
