React Navigation Add-ons
========================

**NOTE: Features such as navigation events are already available in React Navigation and this library is no longer maintained. Please don't use it in your app.**

Useful addons for React Navigation.

## Usage

You'd need to wrap the navigators with our `enhance` function. For example, to wrap `StackNavigator`:

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

Navigation options are usually tightly coupled to your component. This method allows you to configure and update the navigation options from your component rather than using the static property and params, which means you can use your component's props and state, as well as any instance methods.

**Example:**

```js
class HomeScreen extends Component {
  componentWillMount() {
    this.props.navigation.setOptions({
      headerTitle: this.props.navigation.state.params.user,
      headerTintColor: this.props.theme.tintColor,
      headerLeft: (
        <TouchableOpacity onPress={this._handleSave}>
          <Text>Save</Text>
        </TouchableOpacity>
      )
    });
  }

  componentWillReceiveProps(nextProps) {
    this.props.navigation.setOptions({
      headerTitle: nextProps.navigation.state.params.user,
      headerTintColor: nextProps.theme.tintColor,
    });
  }

  _handleSave = () => {
    ...
  };

  render() {
    ...
  }
}
```

Calling `setOptions` with an plain object does a merge with previous options. You don't have to pass the full configuration object again.

### `navigation.addListener`

Sometimes you want to do something when the screen comes into focus, for example fetch some data, and cancel the operation when screen goes out of focus. This method allows you to listen to events like `focus` and `blur`.

**Example:**

```js
class HomeScreen extends Component {
  componentDidMount() {
    this.props.navigation.addListener('focus', this._fetchData);
    this.props.navigation.addListener('blur', this._cancelFetch);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this._fetchData);
    this.props.navigation.removeListener('blur', this._cancelFetch);
  }

  _fetchData = () => {
    ...
  };

  _cancelFetch = () => {
    ...
  };

  render() {
    ...
  }
}
```

In addition to `focus` and `blur`, this also allows you to listen to a `change` event which fires whenever the navigation state changes. The listener receives the state as the argument.

**Example:**

```js
class HomeScreen extends Component {
  componentDidMount() {
    this.props.navigation.addListener('change', this._handleStateChange);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('change', this._handleStateChange);
  }

  _handleStateChange = state => {
    ...
  };

  render() {
    ...
  }
}
```

### `navigation.getParent`

Many times you need a reference to the parent navigation prop if you want to dispatch an action on the parent navigator. This method returns a reference to the navigation prop of the parent navigator.

**Example:**

```js
class SettingsScreen extends Component {
  _popAllTabs = () => {
    const parent = this.props.navigation.getParent();

    if (parent) {
      parent.goBack(null);
    }
  };

  render() {
    ...
  }
}
```

If there's no parent navigator, this method will return `undefined`.
