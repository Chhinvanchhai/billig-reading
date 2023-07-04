
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContent } from '../screens/DrawerContent';
import Main from '../screens/Main'
  const Drawer = createDrawerNavigator();
  const AppStack =  ({navigation}) => {
      return (
          <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name="HomeDrawer" component={Main} />
          </Drawer.Navigator>
      )
  }
  export default AppStack;

