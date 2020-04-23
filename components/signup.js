import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SafeAreaView } from 'react-navigation';


export default class Signup extends Component{
	
	constructor( props ){
		super( props );
		this.state = {
			username: '', password: '',
		};
	}
	
	componentDidMount(){
		this._loadInitilalState().done();
	}
	
	_loadInitilalState = async () => {
		const loggedIn = await this.checkLogin();
		if( loggedIn )
			this.props.navigation.navigate( 'Profile' );
		
		// const value = await AsyncStorage.getItem('user');
		// if ( value !== null ){
		// 	this.props.navigation.navigate('Profile');
		// }
		
	};
	
	async checkLogin( redirectOnFail = false ){
		// this.navigation.navigate('Login');
		const token = await AsyncStorage.getItem( 'jwt' );
		if( !token )
			return false;
		
		let loggedIn = false;
		
		await fetch( Config.API_HOST + '/api/auth/me', {
			method: 'POST', headers: {
				Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token,
			},
		} )
			.then( ( response ) => response.json() )
			.then( async responseJson => {
				loggedIn = responseJson['id'];
				await AsyncStorage.setItem( 'user', responseJson['name'] );
				
			} ).catch( async error => {
				await AsyncStorage.removeItem( 'jwt' );
				await AsyncStorage.removeItem( 'user' );
			} );
		
		if( !loggedIn && redirectOnFail ){
			this.props.navigation.navigate( 'Login' );
		}
		
		return loggedIn;
	}
	
	cancel(){
		this.props.navigation.navigate( 'Login' );
	}
	
	onRead = e => {
		console.log( 'read', e.data );
		console.log( 'read', e );
		// Linking.openURL(e.data).catch(err =>
		// 	                              console.error('An error occured', err)
		// );
	};
	
	render(){
		return ( <SafeAreaView style={ styles.container }>
			
			<View style={ [ styles.boxContainer, styles.boxOne ] }>
				<Text style={ styles.header }>- Registrierung -</Text>
			</View>
			
			<View style={ [ styles.boxContainer, styles.boxTwo ] }>
				
				<QRCodeScanner
					onRead={ this.onRead }
					flashMode={ QRCodeScanner.Constants.FlashMode.torch }
					topContent={
						<Text style={ styles.centerText }>
							Bitte den Registrierungs QRCode scannen.
						</Text>
					}
					bottomContent={
						<TouchableOpacity style={ styles.buttonTouchable }>
							<Text style={ styles.buttonText }>OK. Got it!</Text>
						</TouchableOpacity>
					}
				/>
			
			</View>
			
			<View style={ [ styles.boxContainer, styles.boxThree ] }>
				
				<TouchableOpacity style={ styles.to } onPress={ () => this.cancel() }>
					<Text style={ styles.btntext }>abbrechen</Text>
				</TouchableOpacity>
			
			</View>
		
		</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create( {
	                                  container: {
		                                  flexDirection: 'column', backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
	                                  }, boxContainer: {
		
		alignItems: 'center', justifyContent: 'space-between', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, borderRadius: 5, opacity: 5,
	}, boxOne: {
		
		alignItems: 'center', justifyContent: 'center', marginTop: 50, paddingLeft: 15, paddingRight: 15, marginBottom: 50,
	}, boxTwo: {
		marginTop: 50, alignItems: 'stretch', justifyContent: 'space-around',
		
	}, boxThree: {
		marginTop: 50, alignItems: 'stretch', justifyContent: 'flex-end',
	}, header: {
		fontSize: 30, color: '#373737', fontWeight: 'bold',
	}, textInput: {
		color: '#333333',
		padding: 16, borderColor: '#000000', borderWidth: 1, marginBottom: 15,
	}, to: {
		alignSelf: 'stretch', alignItems: 'center', backgroundColor: '#fff', padding: 15, opacity: 1, marginTop: 20, borderRadius: 10, borderColor: '#000000', borderWidth: 2,
	}, btntext: {
		fontSize: 20, color: '#373737', fontWeight: 'bold',
		
	},
                                  } );

