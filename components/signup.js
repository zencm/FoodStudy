import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { SafeAreaView } from 'react-navigation';
import { FSService, useFSService } from '../services/food-study.service';


const B = ( props ) => <Text style={ { fontWeight: 'bold' } }>{ props.children }</Text>;

export default class Signup extends Component{
	
	render(){
		if( !this.state.manualEntry && !this.state.key )
			return (
				<QRCodeScanner
					onRead={ this.onRead }
					// flashMode={ QRCodeScanner.Constants.FlashMode.torch }
					topContent={
						<View>
							<Spinner visible={ this.state?.busy } />
							<Text style={ styles.centerText }>
								Bitte den Registrierungs QRCode scannen
							</Text>
						</View>
					}
					bottomContent={
						<View style={ [ styles.boxContainer, styles.boxOne ] }>
							<TouchableOpacity style={ [ styles.to, { marginTop: 20, marginBottom: 40 } ] } onPress={ () => this.toggleManual() }>
								<Text style={ styles.btntext }>Code manuell eingeben</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={ () => this.cancel() }>
								<Text>abbrechen</Text>
							</TouchableOpacity>
						</View>
					}
				/>
			);
		
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		if( !this.state.credentials )
			return ( <KeyboardAwareScrollView style={ styles.container } contentInsetAdjustmentBehavior="automatic">
					<SafeAreaView style={ { flex: 1 } }>
						<Spinner visible={ this.state?.busy } />
						<View style={ [ styles.boxContainer, styles.boxOne ] }>
							<Text style={ styles.header }>- Registrierung -</Text>
							
							{ !this.state.study &&
							  <TouchableOpacity style={ [ styles.toS, { marginTop: 20 } ] } onPress={ () => this.toggleManual() }>
								  <Text style={ styles.btntext }>QR Code scannen</Text>
							  </TouchableOpacity>
							}
						</View>
						
						{ this.state.study
						  ?
						  <View style={ [ styles.boxContainer, styles.boxOne, { textAlign: 'center' } ] }>
							  <Text>Der eingegebene Registrierungscode ist gültig.{ "\n" }Wollen Sie an dieser Studie teilnehmen?</Text>
							  <Text style={ { marginTop: 20, marginBottom: 20, fontWeight: 'bold', fontSize: 20 } }>{ this.state.study.name }</Text>
							
							
							  <View style={ [ styles.boxContainer, styles.boxOne ] }>
								  <TextInput
									  style={ [ styles.textInput, { width: 300 } ] } placeholder="Teilnehmerkennung"
									  onChangeText={ ( text ) => this.setState( { participant: text } ) }
									  value={ this.state.participant }
									  underlineColorAndroid="transparent"
									  autoCorrect={ false } autoCapitalize={ 'none' }
								  />
								  <Text style={ { fontSize: 12, fontStyle: 'italic', marginBottom: 10 } }>Bitte hier die Teilnehmerkennung eintragen sofern vorhanden.</Text>
								
								  <TouchableOpacity style={ [ styles.to, styles.buttonTouchable, { marginTop: 20 } ] } onPress={ () => this.performSignup() }>
									  <Text style={ styles.buttonText }>Ja - Zugang freischalten</Text>
								  </TouchableOpacity>
							  </View>
						
						  </View>
						
						  :
						  <View style={ [ styles.boxContainer, styles.boxTwo ] } visible={ !this.state.study }>
							  <TextInput
								  onChangeText={ ( text ) => this.setState( { key: text } ) }
								  value={ this.state.key }
								
								  autoCapitalize={ 'none' } autoCorrect={ false }
								
								  style={ styles.textInput } placeholder="Schlüssel"
								  underlineColorAndroid="transparent"
							  />
							
							  <TextInput
								  placeholder="Code"
								  onChangeText={ ( text ) => this.setState( { response: text } ) }
								  value={ this.state.response }
								
								  autoCapitalize={ 'none' } autoCorrect={ false }
								  onSubmitEditing={ this.checkSignup }
								
								  style={ styles.textInput }
								  underlineColorAndroid='transparent'
							  />
							
							  <View style={ [ styles.boxContainer, styles.boxOne ] }>
								  <TouchableOpacity style={ [ styles.to, styles.buttonTouchable, { marginTop: 20 } ] } onPress={ () => this.loadSignup() }>
									  <Text style={ styles.buttonText }>Daten prüfen</Text>
								  </TouchableOpacity>
							  </View>
						  </View>
							
						}
						
						
						<View style={ [ styles.boxContainer, styles.boxThree ] }>
							
							<View style={ [ styles.boxContainer, styles.boxOne ] }>
								<TouchableOpacity onPress={ () => this.cancel() }>
									<Text>abbrechen</Text>
								</TouchableOpacity>
							</View>
						
						</View>
					
					</SafeAreaView>
				</KeyboardAwareScrollView>
			);
		
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		return (
			<KeyboardAwareScrollView style={ styles.container } contentInsetAdjustmentBehavior="automatic">
				<SafeAreaView style={ { flex: 1 } }>
					<Spinner visible={ this.state?.busy } />
					<View style={ [ styles.boxContainer, styles.boxOne, { marginBottom: 0 } ] }>
						<Text style={ styles.header }>- Registrierung -</Text>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxTwo, { marginBottom: 50 } ] }>
						<Text>Ihre Zugangsdaten für die Studie <B>{ this.state.study.name }</B></Text>
						
						<View style={ [ styles.boxContainer, { marginTop: 20, textAlign: 'left', alignItems: 'flex-start', marginLeft: 30 } ] }>
							<Text>Benutzername: <B>{ this.state.credentials.username }</B></Text>
							<Text>Passwort: <B>{ this.state.credentials.password }</B></Text>
							{ this.state.credentials.participant && <Text style={ { marginTop: 5 } }>Teilnehmerkennung: <B>{ this.state.credentials.participant }</B></Text> }
						</View>
						
						<Text style={ { marginTop: 20, marginBottom: 20, fontWeight: 'bold' } }>Bitte bewahren Sie diese Daten sicher auf!</Text>
						<Text style={ { fontStyle: 'italic', fontSize: 12 } }>(…z.B. notieren oder Screenshot). Aus Gründen der Sicherheit können diese nicht wiederhergestellt werden. Zur Bestätigung bitte das Passwort unten
							bestaetigen.</Text>
					
					</View>
					
					<View style={ { borderBottomColor: 'black', borderBottomWidth: 1 } } />
					
					<View style={ [ styles.boxContainer, { marginTop: 20 } ] }>
						<Text style={ styles.header }>- Login -</Text>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxTwo ] }>
						<TextInput
							style={ styles.textInput } placeholder="Benutzername"
							onChangeText={ ( text ) => this.setState( { username: text } ) }
							value={ this.state.username }
							underlineColorAndroid="transparent"
							
							autoCorrect={ false }
							autoCapitalize={ 'none' } textContentType='username'
						/>
						<TextInput
							style={ styles.textInput } placeholder="Passwort"
							onChangeText={ ( text ) => this.setState( { password: text } ) }
							underlineColorAndroid='transparent'
							secureTextEntry={ true }
							
							autoCorrect={ false }
							autoCapitalize={ 'none' } textContentType='password'
							onSubmitEditing={ this.login }
						/>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxThree ] }>
						<TouchableOpacity style={ styles.to } onPress={ () => this.login() }>
							<Text style={ styles.btntext }>Anmelden</Text>
						</TouchableOpacity>
					</View>
				
				</SafeAreaView>
			</KeyboardAwareScrollView>
		);
	}
	
	constructor( props ){
		super( props );
		this.state = {
			username: '', password: '', participant: null,
			key: '', response: '',
			study: null, credentials: null,
			manualEntry: true,
			busy: false,
		};
		
	}
	
	componentDidMount(){
		this._loadInitilalState().done();
	}
	
	_loadInitilalState = async () => {
		const loggedIn = await FSService.checkLogin();
		if( loggedIn )
			this.props.navigation.navigate( 'Profile' );
		
	};
	
	
	cancel(){
		this.props.navigation.navigate( 'Login' );
	}
	
	onRead = e => {
		if( !e.data )
			return;
		
		const [ key, response ] = e.data.split( /:/ );
		
		if( !key || !response )
			return;
		
		this.setState( { key, response } );
		this.loadSignup( key, response );
		
		// Linking.openURL(e.data).catch(err =>
		// 	                              console.error('An error occured', err)
		// );
	};
	
	toggleManual(){
		this.setState( state => ( {
				manualEntry: !state.manualEntry,
			}
		) );
	};
	
	
	
	async loadSignup( key?:string, response?:string ){
		this.setState( { busy: true } );
		
		if( !key )
			key = this.state.key;
		if( !response )
			response = this.state.response;
		
		
		await fetch( Config.API_HOST + '/api/study/signup', {
			method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify( { key, response } ),
		} )
			.then( ( response ) => response.json() )
			.then( async responseJson => {
				if( !responseJson || !responseJson['study'] ){
					this.setState( { study: null, busy: false } );
					Alert.alert( 'Es ist keine entsprechende Studie verfügbar.' );
					return;
				}
				
				this.setState( { study: responseJson['study'], busy: false } );
				
			} ).catch( async error => {
				this.setState( { study: null, busy: false } );
				Alert.alert( 'Es ist keine entsprechende Studie verfügbar.' );
			} );
		
	}
	
	
	async performSignup( ignoreEmptyParticipant = false ){
		this.setState( { busy: true } );
		
		const key = this.state.key;
		const response = this.state.response;
		const participant = this.state.participant;
		
		// we require a participant ID for now
		const participantRequired = true;
		
		if( !participant && !ignoreEmptyParticipant && !participantRequired ){
			Alert.alert(
				'Teilnehmerkennung',
				'Es wurde keine Teilnehmerkennung eingegeben.',
				[
					// { text: 'OHNE Kennung fortfahren', onPress: () => this.performSignup( true ) },
					{ text: 'Kennung eingeben', onPress: () => this.setState( { busy: false } ), style: 'cancel' },
				],
				{ cancelable: false },
			);
			return;
		}
		
		
		await fetch( Config.API_HOST + '/api/study/signup', {
			method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify( { key, response, participant, signup: true } ),
		} )
			.then( ( response ) => response.json() )
			.then( async responseJson => {
				this.setState( { busy: false, study: responseJson['study'], credentials: responseJson['credentials'], username: responseJson['credentials']['username'] } );
				
			} ).catch( async error => {
				this.setState( { busy: false, study: null, credentials: null } );
			} );
	}
	
	login = async () => {
		
		return ;
		/*let username = this.state?.username?.trim();
		let password = this.state?.password?.trim();
		
		if( !username?.length || !password?.length ){
			Alert.alert( 'Hinweis!', 'Bitte Benutzernamen und Passwort eingeben' );
			return;
		}
		
		this.setState( { busy: true } );
		
		const loggedIn = await useFSService().login( this.state.username, this.state.password )
		                           .catch( error => {
			                           Alert.alert( 'Fehler beim Login', error.error );
		                           } );
		
		this.setState( { busy: false } );
		
		if( loggedIn )
			this.props.navigation.navigate( 'Profile' );
		*/
	};
	
}

const styles = StyleSheet.create( {
	                                  container: {
		                                  flex: 1,
		                                  backgroundColor: '#fff', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
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
	}, toS: {
		alignSelf: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 5, paddingTop: 20, opacity: 1, marginTop: 20, borderRadius: 10, borderColor: '#000000', borderWidth: 2,
	}, to: {
		alignSelf: 'stretch', alignItems: 'center', backgroundColor: '#fff', padding: 15, opacity: 1, marginTop: 20, borderRadius: 10, borderColor: '#000000', borderWidth: 2,
	}, btntext: {
		fontSize: 14, color: '#373737', fontWeight: 'bold', padding: 15, marginTop: -15,
	},
                                  } );

