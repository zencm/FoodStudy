import React from 'react';
import {Image} from 'react-native';

import OneSignal from 'react-native-onesignal';

import help from './components/icons/help.png';
import fork from './components/icons/fork.png';

import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import Login from './components/Login';
import Profile from './components/Profile';
import Consup from './components/Consup';
import Searchfilter from './components/Searchfilter'
import Amountchoose from'./components/Amountchoose'
import Endpage from './components/Endpage'
import Digpage from './components/Digpage'
import Moopage from './components/Moopage'
import Slepage from './components/Slepage'


const TabNavigator = createBottomTabNavigator(
    {
    Profile:Profile,
    Consup: Consup,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Profile') {
                    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
                    return <Image source={fork} style={{width: 25, height: 25, tintColor}}/>


                } else if (routeName === 'Consup') {
                    iconName = `ios-options${focused ? '' : '-outline'}`;
                    return <Image source={help} style={{width: 25, height: 25, tintColor}}/>

                }

            },
        }),
        tabBarOptions: {
            activeTintColor: '#4097e9',
            showLabel: false,
        },
    }

);

const RootStack = createStackNavigator(
    {
        Login: Login,
        Searchfilter: Searchfilter,
        Amountchoose: Amountchoose,
        TabNavigator: TabNavigator,
        Endpage: Endpage,
        Digpage: Digpage,
        Moopage: Moopage,
        Slepage: Slepage,
    },
    {
        headerMode: 'none',
        initialRouteName: 'Login',
    }
);



const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
constructor(properties) {
  super(properties);
  OneSignal.init("40ec7630-6568-49d1-85d5-cfff1d14a5d8", {kOSSettingsKeyAutoPrompt : true});
}
    render() {
        return <AppContainer />;
    }
}
