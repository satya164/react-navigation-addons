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
      let enhancedScreen = screens[screen].screen;

      if(typeof screens[screen].screen.router === 'undefined') {
        enhancedScreen = enhanceScreen(enhancedScreen);
      }

      nextScreens[screen] = {
        ...screens[screen],
        screen: enhancedScreen,
      };
    }

    return enhanceNavigator(Navigator(nextScreens, ...rest));
  };
}
