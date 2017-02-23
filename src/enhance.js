/* @flow */

import enhanceNavigator from './enhanceNavigator';
import enhanceScreen from './enhanceScreen';
import enhanceComponent from './enhanceComponent';

export default function(Navigator: *) {
  return (screens, options) => {
    const nextScreens = {};
    const nextOptions = {};

    for (const screen in screens) {
      nextScreens[screen] = {
        ...screens[screen],
        screen: enhanceScreen(screens[screen].screen),
      };
    }

    if (options) {
      for (const option in options) {
        if (option.endsWith('Component') && typeof options[option] === 'function') {
          nextOptions[option] = enhanceComponent(options[option]);
        } else {
          nextOptions[option] = options[option];
        }
      }
    }

    return enhanceNavigator(Navigator(nextScreens, nextOptions));
  };
}
