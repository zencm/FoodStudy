import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { SafeAreaView } from 'react-navigation';


export default class Consup extends Component{
	
	constructor( props ){
		super( props );
		this.state = {
			aUser: '', sleep: '', mood: '', digestion: '', url: Config.API_HOST + '/anleitung', url2: Config.API_HOST + '/datenschutz',
		};
	}
	
	async componentDidMount(){
		let value = await AsyncStorage.getItem( 'user' );
		this.setState( { aUser: value } );
	}
	
	handleClick = () => {
		Linking.canOpenURL( this.state.url ).then( supported => {
			if( supported ){
				Linking.openURL( this.state.url );
			}else{
				console.log( 'Don\'t know how to open URI: ' + this.state.url );
			}
		} );
	};
	
	handleClick2 = () => {
		Linking.canOpenURL( this.state.url2 ).then( supported => {
			if( supported ){
				Linking.openURL( this.state.url2 );
			}else{
				console.log( 'Don\'t know how to open URI: ' + this.state.url2 );
			}
		} );
	};
	
	logout = async () => {
		await fetch( Config.API_HOST + '/api/auth/logout', {
			method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+ (await AsyncStorage.getItem( 'jwt' ) )},
		} );
		
		await AsyncStorage.removeItem( 'jwt' );
		await AsyncStorage.removeItem( 'user' );
		
		this.setState({username: '', password: ''});
		
		this.props.navigation.navigate( 'Login' );
	};
	
	// logout = () => {
	//     this.setState({aUser: ''});
	//     AsyncStorage.setItem('user','');
	//     const { navigate } = this.props.navigation;
	//     navigate('Login', {
	//         aUser: '',
	//     })
	// };
	
	render(){
		return ( <SafeAreaView style={ styles.container }>
				
				<ScrollView contentContainerStyle={ [ styles.contentContainer ] }>
					
					<View style={ [ styles.boxContainer, styles.boxLogout ] }>
						<TouchableOpacity onPress={ this.logout }>
							<Text >logout</Text>
						</TouchableOpacity>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxTwo ] }>
						<TouchableOpacity onPress={ this.handleClick }>
							<Text style={ styles.text2 }>Anleitung</Text>
							<Text style={ styles.text }>{ this.state.url }</Text>
						</TouchableOpacity>
					</View>
					
					<View style={ [ styles.boxContainer, styles.boxTwo ] }>
						<TouchableOpacity onPress={ this.handleClick2 }>
							<Text style={ styles.text2 }>Kontakt</Text>
							<Text style={ styles.text }>Email: anne-katrin.muth@dife.de</Text>
						</TouchableOpacity>
					</View>
					
					
					{/*<View style={[styles.boxContainer, styles.boxTwo]}>*/ }
					{/*<TouchableOpacity onPress={this.logout}>*/ }
					{/*<Text style={styles.text2}>{this.state.aUser}</Text>*/ }
					{/*<Text style={styles.text2}>Logout</Text>*/ }
					{/*</TouchableOpacity>*/ }
					{/*</View>*/ }
				
				
				</ScrollView>
			
			
			</SafeAreaView>
		
		);
	}
}

const styles = StyleSheet.create(
	{
		contentContainer: {
			paddingVertical: 20,
			
		},
		container: {},
		boxContainer: {
			flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, borderRadius: 5, opacity: 5, marginBottom: 10,
		}, boxTwo: {
			flex: 1, alignItems: 'stretch', paddingLeft: 15, paddingRight: 15, justifyContent: 'space-around', backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: 1,
		},
		boxLogout: {
			flex: 1, textAlign: 'center', marginBottom: 30, backgroundColor: 'transparent'
		},
		
		text: {
			alignSelf: 'stretch', fontSize: 16, color: '#373737',
			
		}, text2: {
			alignSelf: 'stretch', fontSize: 22, fontWeight: 'bold', color: '#373737',
			
		}, to: {
			alignSelf: 'stretch', alignItems: 'center', backgroundColor: '#ffffff', padding: 15, opacity: 1, borderRadius: 10, borderColor: '#000000', borderWidth: 2,
		}, btntext: {
			fontSize: 20,
		},
	} );
