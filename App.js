import React from 'react';
import { Image } from 'react-native';
// import OneSignal from 'react-native-onesignal';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Amountchoose from './components/Amountchoose';
import Consup from './components/Consup';
import Endpage from './components/Endpage';

import fork from './components/icons/fork.png';
import help from './components/icons/help.png';

import Login from './components/Login';
import Profile from './components/Profile';
import QuestionView from './components/QuestionView';
import Searchfilter from './components/Searchfilter';
import signup from './components/signup';
import { FSProvider } from './services/food-study.service';



const TabNavigator = createBottomTabNavigator( {
	                                               Profile: {
		                                               screen: Profile,
		                                               navigationOptions: {
			                                               tabBarLabel: 'Home',
			                                               tabBarIcon: ( { tintColor } ) => (
				                                               <Image source={ fork } style={ { width: 25, height: 25, tintColor } } />
			                                               ),
		                                               },
	                                               },
	                                               Info: {
		                                               screen: Consup,
		                                               navigationOptions: {
			                                               tabBarLabel: 'Info',
			                                               tabBarIcon: ( { tintColor } ) => (
				                                               <Image source={ help } style={ { width: 25, height: 25, tintColor } } />
			                                               ),
		                                               },
	                                               },
                                               }, {
	                                               tabBarOptions: {
		                                               showLabel: false,
		
		                                               activeTintColor: '#22508e',
		                                               activeBackgroundColor: '#9c9c9c',
		                                               inactiveBackgroundColor: '#9c9c9c',
		                                               inactiveTintColor: '#ffffff',
		                                               style: {
			                                               backgroundColor: '#9c9c9c',
		                                               },
	                                               },
                                               } );

const RootStack = createStackNavigator( {
	                                        Login: Login,
	                                        Searchfilter: Searchfilter,
	                                        Amountchoose: Amountchoose,
	                                        TabNavigator: TabNavigator,
	                                        Endpage: Endpage,
	                                        Questions: QuestionView,
	                                        // Digpage: Digpage,
	                                        // Moopage: Moopage,
	                                        // Slepage: Slepage,
	                                        signup,
                                        }, {
	                                        headerMode: 'none', initialRouteName: 'Login',
                                        } );

const AppContainer = createAppContainer( RootStack );

export default class App extends React.Component{
	constructor( properties ){
		super( properties );
		
		// OneSignal.init(Config.ONE_SIGNAL_ID, {kOSSettingsKeyAutoPrompt: true});
		
	}
	
	componentDidMount(){
	
	}
	
	
	render(){
		return (
			<FSProvider>
				<AppContainer />
			</FSProvider>
		);
	}
	
}


