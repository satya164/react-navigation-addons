/* @flow */

import enhanceNavigator from './enhanceNavigator';
import enhanceScreen from './enhanceScreen';
import type { NavigationComponent } from 'react-navigation/src/TypeDefinition';

export default function(Navigator: *) {
  return (
    screens: { [key: string]: { screen: NavigationComponent } },
    ...rest: Array<*>
  ) => {
    const nextScreens = {};

    for (const screen in screens) {
      const nextScreen = screens[screen].screen;
      const isNavigator = typeof nextScreen.router !== 'undefined';

      nextScreens[screen] = {
        ...screens[screen],
        screen: isNavigator ? nextScreen : enhanceScreen(nextScreen),
      };
    }

    return enhanceNavigator(Navigator(nextScreens, ...rest));
  };
}
