/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import Manga from './components/manga';
import HomeScreen from './components/home';
import Profile from './components/profile';
import Fiche from './components/fiche';
import ChapterDisplay from './components/chapter'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home(){
  return(<Tab.Navigator initialRouteName="Home">
  <Tab.Screen
    name="Portal"
    component={HomeScreen}
    options={{
      tabBarLabel: 'Portal',
      tabBarIcon: ({color}) => (
        <MaterialCommunityIcons name="home" color={color} size={26} />
      ),
    }}
  />
  <Tab.Screen
    name="Story"
    component={Manga}
    options={{
      tabBarLabel: 'Story',
      tabBarIcon: ({color}) => (
        <MaterialCommunityIcons name="book" color={color} size={26} />
      ),
    }}
  />
  <Tab.Screen
    name="Profile"
    component={Profile}
    options={{
      tabBarLabel: 'Profile',
      tabBarIcon: ({color}) => (
        <MaterialCommunityIcons
          name="account"
          color={color}
          size={26}
        />
      ),
    }}
  />
</Tab.Navigator>)
}

export default function App() {
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
        },
      }}
    >
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Fiche" component={Fiche} />
            <Stack.Screen name="Chapter" component={ChapterDisplay} />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}
