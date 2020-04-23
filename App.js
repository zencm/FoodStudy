import React from 'react';
import { Image } from 'react-native';

import Config from 'react-native-config';
import OneSignal from 'react-native-onesignal';


import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Amountchoose from './components/Amountchoose';
import Consup from './components/Consup';
import Digpage from './components/Digpage';
import Endpage from './components/Endpage';
import fork from './components/icons/fork.png';

import help from './components/icons/help.png';

import Login from './components/Login';
import Moopage from './components/Moopage';
import Profile from './components/Profile';
import Searchfilter from './components/Searchfilter';
import Slepage from './components/Slepage';
import signup from './components/signup';



const TabNavigator = createBottomTabNavigator({
	Profile: Profile, Consup: Consup,
}, {
	defaultNavigationOptions: ( {navigation} ) => ({
		tabBarIcon: ( {focused, horizontal, tintColor} ) => {
			const {routeName} = navigation.state;
			let iconName;
			if ( routeName === 'Profile' ){
				iconName = `ios-information-circle${focused ? '' : '-outline'}`;
				return (<Image source={fork} style={{width: 25, height: 25, tintColor}} />);
			} else if ( routeName === 'Consup' ){
				iconName = `ios-options${focused ? '' : '-outline'}`;
				return (<Image source={help} style={{width: 25, height: 25, tintColor}} />);
			}
		},
	}), tabBarOptions       : {
		style             : {
			backgroundColor: '#9c9c9c',
		}, activeTintColor: '#22508e', showLabel: false, activeBackgroundColor: '#9c9c9c', inactiveBackgroundColor: '#9c9c9c', inactiveTintColor: '#ffffff',
	},
});

const RootStack = createStackNavigator( {
	                                        Login: Login,
	                                        Searchfilter: Searchfilter,
	                                        Amountchoose: Amountchoose,
	                                        TabNavigator: TabNavigator,
	                                        Endpage: Endpage,
	                                        Digpage: Digpage,
	                                        Moopage: Moopage,
	                                        Slepage: Slepage,
											signup
                                        }, {
	headerMode: 'none', initialRouteName: 'Login',
});

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
	constructor( properties ){
		super(properties);
		
		OneSignal.init(Config.ONE_SIGNAL_ID, {kOSSettingsKeyAutoPrompt: true});
		
	}
	
	
	render(){
		return <AppContainer />;
	}
	
}


