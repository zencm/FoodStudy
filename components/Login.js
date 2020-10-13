import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from 'react-navigation';
import { FSService } from '../services/food-study.service';


export default class Login extends Component{
	
	
	render(){
		return ( <KeyboardAwareScrollView style={ styles.container } contentInsetAdjustmentBehavior="automatic">
				<SafeAreaView style={ { flex: 1 } }>
					<Spinner visible={ this.state?.busy } />
					
					
					<View style={ [ styles.boxContainer, styles.boxOne ] }>
						<Text style={ styles.header }>- Willkommen -</Text>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxTwo ] }>
						<TextInput
							style={ styles.textInput } placeholder="Benutzername"
							onChangeText={ ( text ) => this.setState( { username: text } ) }
							value={ this.state.username }
							underlineColorAndroid="transparent"
							
							autoCorrect={ false }
							autoCapitalize='none' textContentType='username'
						/>
						
						<TextInput
							style={ styles.textInput } placeholder="Passwort"
							onChangeText={ ( text ) => this.setState( { password: text } ) }
							secureTextEntry={ true } underlineColorAndroid='transparent'
							
							autoCorrect={ false }
							autoCapitalize='none' textContentType='password'
							onSubmitEditing={ this.login }
						/>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxThree ] }>
						<TouchableOpacity style={ styles.to } onPress={ () => this.login() }>
							<Text style={ styles.btntext }>Anmelden</Text>
						</TouchableOpacity>
					</View>
					
					<View style={ [ styles.boxContainer, { marginTop: 50, marginBottom: 50 } ] }>
						<TouchableOpacity onPress={ () => this.registration() }>
							<Text>Registrieren</Text>
						</TouchableOpacity>
					
					</View>
				
				</SafeAreaView>
			</KeyboardAwareScrollView>
		);
	}
	
	
	
	constructor( props ){
		super( props );
		this.state = {
			busy: false,
			username: '', password: '',
		};
	}
	
	componentDidMount(){
		this._loadInitilalState().done();
	}
	
	_loadInitilalState = async () => {
		this.setState( { busy: true } );
		try{
			const loggedIn = await FSService.checkLogin();
			this.setState( { busy: false } );
			if( loggedIn )
				this.props.navigation.navigate( 'Profile' );
			
		}catch(e){
			this.setState( { busy: false } );
		}
		
		// else
		// 	this.props.navigation.navigate( 'Login' );
		
	};
	
	registration = () => {
		
		this.props.navigation.navigate( 'signup' );
		
		
		//
		// const { username }  = this.state ;
		// const { password }  = this.state ;
		//
		// fetch( Config.API_HOST+'/auth/register', {
		//     method: 'POST',
		//     headers: {
		//         'Accept': 'application/json',
		//         'Content-Type': 'application/json',
		//     },
		//     body: JSON.stringify({
		//         username: username,
		//         password: password
		//
		//     })
		//
		// }).then((response) => response.json())
		//     .then((responseJson) => {
		//
		//         Alert.alert('Hinweis!', responseJson);
		//
		//     }).catch((error) => {
		//     console.error(error);
		// });
		
		
	};
	
	login = async () => {
		
		let username = this.state?.username?.trim();
		let password = this.state?.password?.trim();
		
		if( !username?.length || !password?.length ){
			Alert.alert( 'Hinweis!', 'Bitte Benutzernamen und Passwort eingeben' );
			return;
		}
		
		this.setState( { busy: true } );
		
		const loggedIn = await FSService.login( this.state.username, this.state.password )
		                                .catch( error => {
			                                setTimeout(()=>{
				                                Alert.alert( 'Fehler beim Login', error.message );
			                                }, 100);
		                                } );
		
		this.setState( { busy: false } );
		
		if( !!loggedIn ){
			setTimeout(()=>{
				this.props.navigation.navigate( 'Profile' );
			}, 10);
		}
		
		
		/*
		
		if( ( this.state.username === '' && this.state.password === '' )
		    || ( this.state.username === '' && this.state.password !== '' )
		    || ( this.state.password === '' && this.state.username !== '' )
		){
			Alert.alert( 'Hinweis!', 'Bitte Benutzernamen und Passwort eingeben' );
			
		}else{
			this.setState( { busy: true } );
			fetch( Config.API_HOST + '/api/auth/login', {
				method: 'POST', headers: {
					Accept: 'application/json', 'Content-Type': 'application/json',
				}, body: JSON.stringify( {
					                         username: this.state.username, password: this.state.password,
				                         } ),
			} )
				.then( ( response ) => response.json() )
				.then( async ( responseJson ) => {
					this.setState( { busy: false});
					if( !responseJson || !responseJson['access_token'] ){
						Alert.alert( 'Fehler beim Login', responseJson.error );
						return;
					}
					const token = responseJson['access_token'];
					
					const user = await fetch( Config.API_HOST + '/api/auth/me', {
						method: 'POST', headers: {
							Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token,
						},
					} ).then( ( response ) => response.json() );
					
					await Promise.all(
						AsyncStorage.setItem( 'jwt', token ),
						AsyncStorage.setItem( 'user', user.name ),
					);
					
					this.setState( { username: '', password: '' } );
					
					this.props.navigation.navigate( 'Profile' );
					
					
					
				} ).catch( ( error ) => {
				console.error( error );
				Alert.alert( 'Fehler beim Login', error.error );
				this.setState( { busy: false } );
			} );
			
			
		}*/
		
	};
	
	
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
