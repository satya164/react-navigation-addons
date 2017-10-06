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
      let enhancedScreen;

      if(typeof screens[screen].screen.router !== 'undefined') {
        enhancedScreen = enhanceNavigator(screens[screen].screen);
      } else {
        enhancedScreen = enhanceScreen(screens[screen].screen);
      }

      nextScreens[screen] = {
        ...screens[screen],
        screen: enhancedScreen,
      };
    }

    return enhanceNavigator(Navigator(nextScreens, ...rest));
  };
}
