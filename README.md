React Navigation Add-ons
========================

**NOTE: This is an experiment. If you want to use this in your app, please copy the files instead of using the repo directly. The API can change anytime or the repo might be deleted.**

Useful addons for React Navigation.

## Usage:

You'd need to wrap the navigators with our `enhance` function. For example, to wrap `Stacknavigator`:

```js
import { StackNavigator } from 'react-navigation';
import { enhance } from 'react-navigation-addons';

export default Stacks = enhance(StackNavigator)({
  Home: { screen: HomeScreen },
  Settings: { screen: SettingsScreen },
});
```

## API

### `navigation.setOptions`

Navigation options are usually tightly coupled to your component. This allows you to configure and update the navigation options from your component rather than using the static property and params, which means you can use your component's props and state, as well as any instance methods.

```js
import React, { Component } from 'react';
import { NavigationOptions } from 'react-navigation-addons';

export default class HomeScreen extends Component {
  componentWillMount() {
    this.props.navigation.setOptions({
      header: {
        title: this.props.navigation.state.params.user,
        tintColor: this.props.theme.tintColor,
        left: (
          <TouchableOpacity onPress={this._handleSave}>
            <Text>Save</Text>
          </TouchableOpacity>
        )
      };
    });
  }

  componentWillReceiveProps(nextProps) {
    this.props.navigation.setOptions({
      header: {
        title: nextProps.navigation.state.params.user,
        tintColor: nextProps.theme.tintColor,
      }
    });
  }

  _handleSave = () => {
    ...
  }

  render() {
    ...
  }
}
```

You can still use the static `navigationOptions` property and use `navigation.setOptions` only to update them if you want.

### `withNavigationFocus` HOC (Not implemented)

This allows you to wrap any child component of a screen and receive an `isFocused` prop which tell you if the parent screen is in focus.

```js
import React, { Component } from 'react';
import { withNavigationFocus } from 'react-navigation-addons';

class Post extends Component {
  render() {
    return (
      <VideoPlayer isPlaying={this.props.isFocused} />
    );
  }
}

export default withNavigationFocus(Post);
```
