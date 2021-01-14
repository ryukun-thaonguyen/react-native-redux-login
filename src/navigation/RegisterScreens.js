import React from 'react';
import { Navigation } from 'react-native-navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';

import Login from '../screens/Login';
import Home from '../screens/Home';
import SignUp from '../screens/Login/SignUp';
import ForgotPassword from '../screens/Login/ForgotPassword';

const SCREENS_WITH_REDUX = {
  Login,
  Home,
  SignUp,
  ForgotPassword,
};
const SCREENS = {};

function registerScreens(store, persistor) {
   console.log("register screen");
  const PersistProvider = props => {
    const { children } = props;
    console.log(props)
  //   <PersistGate loading={null} persistor={persistor}>
  //   {children}
  // </PersistGate>
    return (
      <Provider {...props}>
     {children}
      </Provider>
    );
  };
  Object.keys(SCREENS_WITH_REDUX).map(screenName => {
    Navigation.registerComponentWithRedux(
      screenName,
      () => gestureHandlerRootHOC(SCREENS_WITH_REDUX[screenName]),
      PersistProvider,
      store,
    );
  });

  Object.keys(SCREENS).map(screenName => {
    Navigation.registerComponent(screenName, () => SCREENS[screenName]);
  });
}

export default registerScreens;
