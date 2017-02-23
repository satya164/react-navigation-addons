/* @flow */

import enhanceNavigator from './enhanceNavigator';
import enhanceScreen from './enhanceScreen';

export default function(Navigator: *) {
  return (screens, ...rest) => {
    const nextScreens = {};

    for (const screen in screens) {
      nextScreens[screen] = {
        ...screens[screen],
        screen: enhanceScreen(screens[screen].screen),
      };
    }

    return enhanceNavigator(Navigator(nextScreens, ...rest));
  };
}
