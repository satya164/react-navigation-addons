React Navigation Add-ons
========================

This library contains useful addons for React Navigation which lets you write declarative and simpler code.

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

Navigation options are usually tightly coupled to your component. What if you could configure them inside render instead of in the static property?

```js
import React, { Component } from 'react';
import { NavigationOptions } from 'react-navigation-addons';

export default class HomeScreen extends Component {
  render() {
    return (
      <View>
        <NavigationOptions
          header={{
            title: this.props.userId,
            left: (
              <TouchableOpacity onPress={this._handleSave}>
                <Text>Save</Text>
              </TouchableOpacity>
            )
          }}
        />
        <Posts />
      </View>
    );
  }
}
```

## `withNavigationFocus` HOC

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
