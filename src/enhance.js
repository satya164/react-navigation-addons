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
      nextScreens[screen] = {
        ...screens[screen],
        screen: enhanceScreen(screens[screen].screen),
      };
    }

    return enhanceNavigator(Navigator(nextScreens, ...rest));
  };
}
