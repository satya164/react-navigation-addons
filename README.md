React Navigation Add-ons
========================

**NOTE: This is an experiment. If you want to use this in your app, please copy the files instead of using the repo directly. The API can change anytime or the repo might be deleted.**

Useful addons for React Navigation which lets you write declarative and simpler code.

## Usage:

```js
import { StackNavigator } from 'react-navigation';
import { enhance } from 'react-navigation-addons';

export default Stacks = enhance(StackNavigator)({
  Home: { screen: HomeScreen },
  Settings: { screen: SettingsScreen },
});
```

### Customize navigation options

Navigation options are usually tightly coupled to your component. What if you could configure them inside your component instead of in the static property?

```js
import React, { Component } from 'react';
import { NavigationOptions } from 'react-navigation-addons';

export default class HomeScreen extends Component {
  componentWillMount() {
    this.props.navigation.setOptions({
      header: {
        title: this.props.userId,
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
        title: nextProps.userId,
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
