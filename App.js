import React from 'react';
import { Image } from 'react-native';
import moment from 'moment';
// import { Notifications } from 'react-native-notifications';
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
	
	constructor( props ){
		super( props );
		
		// Notifications.registerRemoteNotifications();
		
		/*Notifications.events().registerNotificationReceivedForeground( ( notification:Notification, completion ) => {
			console.log( `Notification received in foreground: ${ notification.title } : ${ notification.body }` );
			completion( { alert: false, sound: false, badge: false } );
		} );
		
		Notifications.events().registerNotificationOpened( ( notification:Notification, completion ) => {
			console.log( `Notification opened: ${ notification.payload }` );
			completion();
		} );*/
	}
	
	
	async componentDidMount(){
		/*const fireDate = moment().add('30', 'seconds').toDate();
		// const permissions = await Notifications.ios.checkPermissions();
		let localNotification = Notifications.postLocalNotification( {
			                                                             // fireDate: fireDate.toISOString(),
			                                                             body: "Local notification!",
			                                                             title: "Local Notification Title",
			                                                             // sound: "chime.aiff",
			                                                             silent: false,
			                                                             // category: "SOME_CATEGORY",
		                                                             } );*/
		
	}
	
	
	render(){
		return (
			<FSProvider>
				<AppContainer />
			</FSProvider>
		);
	}
	
}


