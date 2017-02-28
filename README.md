React Navigation Add-ons
========================

**NOTE: This is an experiment. If you want to use this in your app, please copy the files instead of using the repo directly. The API can change anytime or the repo might be deleted.**

Useful addons for React Navigation.

## Usage

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

Navigation options are usually tightly coupled to your component. This method allows you to configure and update the navigation options from your component rather than using the static property and params, which means you can use your component's props and state, as well as any instance methods.

**Example:**

```js
class HomeScreen extends Component {
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
  };

  render() {
    ...
  }
}
```

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

In addition to `focus` and `blur`, this also allows you to subscribe to a change event which fires whenever the navigation state changes.

**Example:**

```js
class HomeScreen extends Component {
  componentDidMount() {
    this.props.navigation.addListener('change', this._handleStateChange);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('change', this._handleStateChange);
  }

  _handleStateChange = () => {
    ...
  };

  render() {
    ...
  }
}
```

### `navigation.isFocused`

When you just want to check whether the screen is focused, you can use this method to check whether the screen is focused without having to add the listeners and maintain a local instance property.

**Example:**

```js
class HomeScreen extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.online.count !== this.props.onliine.count && this.props.navigation.isFocused()) {
      this._showNotification();
    }
  }

  _showNotification = () => {
    ...
  };

  render() {
    ...
  }
}
```
