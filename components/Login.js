import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-navigation';

export default class Login extends Component {
	
	constructor( props ){
		super(props);
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
			this.props.navigation.navigate('Profile');
		
		// const value = await AsyncStorage.getItem('user');
		// if ( value !== null ){
		// 	this.props.navigation.navigate('Profile');
		// }
		
	};
	
	async checkLogin( redirectOnFail = false ){
		// this.navigation.navigate('Login');
		const token = await AsyncStorage.getItem('jwt');
		if( !token )
			return false;
		
		let loggedIn = false;
		
		await fetch(Config.API_HOST + '/api/auth/me', {
			method: 'POST', headers: {
				Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token,
			},
		})
			.then(( response ) => response.json())
			.then(async responseJson => {
				loggedIn = responseJson['id'];
				await AsyncStorage.setItem('user', responseJson['name']);
				
			}).catch( async error=>{
				await AsyncStorage.removeItem('jwt');
				await AsyncStorage.removeItem('user');
			});
		
		if( !loggedIn && redirectOnFail ){
			this.props.navigation.navigate('Login');
		}
		
		return loggedIn;
	}
	
	// registration = () =>{
	//
	//     const { username }  = this.state ;
	//     const { password }  = this.state ;
	//
	//     fetch( Config.API_HOST+'/auth/register', {
	//         method: 'POST',
	//         headers: {
	//             'Accept': 'application/json',
	//             'Content-Type': 'application/json',
	//         },
	//         body: JSON.stringify({
	//             username: username,
	//             password: password
	//
	//         })
	//
	//     }).then((response) => response.json())
	//         .then((responseJson) => {
	//
	//             Alert.alert('Hinweis!', responseJson);
	//
	//         }).catch((error) => {
	//         console.error(error);
	//     });
	//
	//
	// };
	
	login = () => {
		
		if ( (this.state.username === '' && this.state.password === '') || (this.state.username === '' && this.state.password !== '') || (this.state.password === '' && this.state.username !== '')
		
		){
			Alert.alert('Hinweis!', 'Bitte Benutzernamen und Passwort eingeben');
		} else{
			
			fetch(Config.API_HOST + '/api/auth/login', {
				method : 'POST', headers: {
					Accept: 'application/json', 'Content-Type': 'application/json',
				}, body: JSON.stringify({
					email: this.state.username, password: this.state.password,
				}),
			})
				.then(( response ) => response.json())
				.then(async ( responseJson ) => {
					
					if( !responseJson || !responseJson['access_token']){
						Alert.alert('Fehler beim Login', responseJson.error);
						return;
					}
					const token = responseJson['access_token'];
					
					const user = await fetch(Config.API_HOST + '/api/auth/me', {
						method: 'POST', headers: {
							Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token,
						},
					}).then(( response ) => response.json());
					
					await Promise.all(
						AsyncStorage.setItem('jwt', token),
						AsyncStorage.setItem('user', user.name)
					);
					
					this.props.navigation.navigate('Profile');
					
					
					
				}).catch(( error ) => {
				console.error(error);
				Alert.alert('Fehler beim Login', error.error);
			});
		}
		
	};
	
	render(){
		return (<SafeAreaView style={styles.container}>
			
			<View style={[styles.boxContainer, styles.boxOne]}>
				<Text style={styles.header}>- Willkommen -</Text>
			</View>
			
			<View style={[styles.boxContainer, styles.boxTwo]}>
				<TextInput
					style={styles.textInput} placeholder="Benutzername (E-Mail Adresse)"
					onChangeText={( text ) => this.setState({username: text})}
					value={this.state.username}
					underlineColorAndroid="transparent"
					
					autoCapitalize={'none'} autoCompleteType={'username'} autoCorrect={false}
				/>
				
				<TextInput
					style={styles.textInput} placeholder="Passwort"
					onChangeText={( text ) => this.setState({password: text})}
					secureTextEntry={true} underlineColorAndroid='transparent'
					
					autoCapitalize={'none'} autoCompleteType={'password'} autoCorrect={false}
					onSubmitEditing={this.login}
				/>
			</View>
			
			<View style={[styles.boxContainer, styles.boxThree]}>
				
				{/*<TouchableOpacity style={styles.to} onPress={() => this.registration()}>*/}
				{/*<Text style={styles.btntext}>Registrieren</Text>*/}
				{/*</TouchableOpacity>*/}
				
				<TouchableOpacity style={styles.to} onPress={() => this.login()}>
					<Text style={styles.btntext}>Anmelden</Text>
				</TouchableOpacity>
			
			</View>
		
		</SafeAreaView>);
	}
}

const styles = StyleSheet.create({
	container      : {
		
		flexDirection: 'column', backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
	}, boxContainer: {
		
		alignItems: 'center', justifyContent: 'space-between', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, borderRadius: 5, opacity: 5,
	}, boxOne      : {
		
		alignItems: 'center', justifyContent: 'center', marginTop: 50, paddingLeft: 15, paddingRight: 15, marginBottom: 50,
	}, boxTwo      : {
		marginTop: 50, alignItems: 'stretch', justifyContent: 'space-around',
		
	}, boxThree    : {
		marginTop: 50, alignItems: 'stretch', justifyContent: 'flex-end',
	}, header      : {
		fontSize: 30, color: '#373737', fontWeight: 'bold',
	}, textInput   : {
		
		padding: 16, borderColor: '#000000', borderWidth: 1, marginBottom: 15,
	}, to          : {
		alignSelf: 'stretch', alignItems: 'center', backgroundColor: '#fff', padding: 15, opacity: 1, marginTop: 20, borderRadius: 10, borderColor: '#000000', borderWidth: 2,
	}, btntext     : {
		fontSize: 20, color: '#373737', fontWeight: 'bold',
		
	},
});
