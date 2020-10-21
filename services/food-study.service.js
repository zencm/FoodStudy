import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';
import React from 'react';
import Config from 'react-native-config';


const FSContext = React.createContext( {} );

export const FSProvider = ( props ) => {
	const [ token ] = React.useState( {
		                                  token: null,
	                                  } );
	return (
		<FSContext.Provider value={ {
			token: token,
		} }>
			{ props.children }
		</FSContext.Provider>
	);
};


class FSServiceClass{
	_studyData:null;
	
	async _axiosHeaders( authToken = null ){
		let conf = {
			headers: {
				// 'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		};
		
		if( authToken )
			if( typeof authToken === 'string' ){
				conf.headers.Authorization = `Bearer ${authToken}`;
			}else if( authToken === true ){
				const token = await this._bearer(false);
				if( !token )
					return null;
				conf.headers.Authorization = `Bearer ${token}`;
			}
		
		return conf;
		
	}
	
	async _bearer( asHeader = false ){
		const token:string = await AsyncStorage.getItem( 'jwt' );
		if( !token )
			return null;
		
		return asHeader
		       ? { headers: { Authorization: `Bearer ${ token }` } }
		       : token;
	}
	
	async questionCatalog( fresh = false ){
		const studyData = await this.studyData( fresh );
		return studyData ? studyData.catalog : null;
	}
	
	async studyData( fresh = false ){
		let studyData = this._studyData;
		
		if( !studyData && !fresh )
			studyData = await AsyncStorage.getItem( 'study', JSON.stringify( studyData ) );
		
		if( !studyData || fresh )
			studyData = await this.refreshStudy();
		
		return studyData;
	}
	
	async refreshStudy(){
		
		// TODO: limit retrieval to when the remote has more recent data only
		
		const bearer = await this._axiosHeaders( true );
		if( !bearer )
			return null;
		
		const studyData = await axios.get( Config.API_HOST + '/api/foodstudy/study', bearer )
		                             .catch( e => null )
		                             .then( r => r?.data );
		
		if( !studyData )
			return null;
		
		await AsyncStorage.setItem( 'study', JSON.stringify( studyData ) );
		
		this._studyData = studyData;
		
		return studyData;
	}
	
	async checkLogin(){
		
		const bearer = await this._axiosHeaders( true );
		if( !bearer )
			return false;
		
		let loggedIn = false;
		const response = await axios.post( Config.API_HOST + '/api/auth/me', null, bearer )
		                            .then( r => r.data );
		
		if( !response ){
			await AsyncStorage.removeItem( 'jwt' );
			await AsyncStorage.removeItem( 'user' );
			
			return false;
		}
		
		
		loggedIn = response['id'];
		await AsyncStorage.setItem( 'user', response['name'] );
		
		if( loggedIn )
			await this.refreshStudy();
		
		return loggedIn;
	}
	
	
	async login( username:string, password:string ){
		const response = await axios.post( Config.API_HOST + '/api/auth/login', { username, password }, await this._axiosHeaders() ).then( r => r.data );
		
		if( !response || response?.error )
			throw new Error( 'Fehler beim Login: ' + response.error );
		
		const token = response['access_token'];
		if( !token )
			throw new Error( 'Fehler beim Login' );
		
		const config = await this._axiosHeaders(token);
		const user = await axios.post( Config.API_HOST + '/api/auth/me', null, config ).then( r => r?.data );
		
		await Promise.all(
			AsyncStorage.setItem( 'jwt', token ),
			AsyncStorage.setItem( 'user', user.name ),
		);
		
		if( user )
			await this.refreshStudy();
		
		return user;
	}
	
	
}

export const FSService = new FSServiceClass;


// export const FSProvider = ( props) => {
// 	const value = {
// 		login: props.login || login,
// 		signUp: props.signUp || signUp,
// 		studyData: props.studyData || studyData,
// 	};
//
// 	return (
// 		<FSProvider.Provider value={value}>
// 			{props.children}
// 		</FSProvider.Provider>
// 	);
// };


