import AsyncStorage from '@react-native-community/async-storage';
import Slider from '@react-native-community/slider';
import React, { Component } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import { NavigationActions, SafeAreaView, StackActions } from 'react-navigation';


export default class QuestionView extends Component{
	
	render(){
		return (
			<SafeAreaView style={ styles.container }>
				{/*<ScrollView contentContainerStyle={ [ styles.contentContainer ] }>*/ }
				
				<FlatList
					data={ this.state.questions }
					// extraData={this.state.answers}
					containerStyle={ { flex: 1 } }
					keyExtractor={ ( item, index ) => item.key }
					renderItem={ ( { item } ) =>
						<View style={ [ styles.boxContainer, styles.boxTwo ] }>
							
							<Text style={ [
								styles.textQuestion,
								this.state.showMissingAnswers ? ( this.state.answers[item.key] ? styles.questionAnswered : styles.questionMissing
								) : '',
							] }>{ item.question } </Text>
							
							{ item.type === 'slider' &&
							  <View style={ [ styles.boxContainer, styles.sliderContainer ] }>
								  <Slider
									  style={ { flex: 1 } }
									  step={ item.config?.step || 1 }
									  minimumValue={ item.config?.min || 0 }
									  maximumValue={ item.config?.max || 10 }
									  value={ this.state.answers[item.key] || Math.ceil( ( ( item.config?.max || 10
									                                                       ) - ( item.config?.min || 0
									                                                       ) + 1
									                                                     ) / 2 ) }
									  onValueChange={ val => ( this.state.answers[item.key] = val, this.setState( { answers: this.state.answers } )
									  ) }
									  onSlidingComplete={ val => ( this.state.answers[item.key] = val, this.setState( { answers: this.state.answers } )
									  ) }
									
									  minimumTrackTintColor={ this.state.answers[item.key] ? null : '#eeeeee' }
									  maximumTrackTintColor={ this.state.answers[item.key] ? null : '#eeeeee' }
								  />
								
								  <View style={ [ styles.boxContainer, styles.sliderLabelContainer ] }>
									  <Text style={ styles.sliderLabel } onPress={ () => ( this.state.answers[item.key] = item.config?.min || 0, this.setState( { answers: this.state.answers } )
									  ) }>{ item.config?.minLabel || 'Sehr schlecht' }</Text>
									  <Text style={ styles.sliderLabel } onPress={ () => ( this.state.answers[item.key] = item.config?.max || 10, this.setState( { answers: this.state.answers } )
									  ) }>{ item.config?.maxLabel || 'Sehr gut' }</Text>
								  </View>
							  </View>
							}
						
						</View>
					}
				/>
				
				{/*</ScrollView>*/ }
				
				<TouchableOpacity style={ styles.to } onPress={ () => this.send() }>
					<Text style={ styles.btntext }>Senden</Text>
				</TouchableOpacity>
			
			</SafeAreaView>
		
		);
	}
	
	
	constructor( props ){
		super( props );
		this.state = {
			questions: null,
			answers: {},
			showMissingAnswers: false,
		};
	}
	
	async componentDidMount(){
		let answered = await AsyncStorage.getItem( 'questions-last-answer' );
		if( answered )
			answered = JSON.parse( answered );
		
		const now = new Date();
		let today = now.getFullYear() +'-'+ now.getMonth() +'-'+ now.getDate();
		if( answered && answered.date === today ){
			this.ret();
			return;
		}
		
		const questions = require( '../data/questions_de.json' );
		this.setState( { questions } );
	}
	
	send = async ( ignoreMissingAnswers = false ) => {
		
		if( !ignoreMissingAnswers && Object.keys( this.state.answers ).length !== this.state.questions.length ){
			Alert.alert(
				'Es wurden nicht alle Fragen beantwortet.',
				'',
				[
					{ text: 'unvollständig absenden', onPress: () => this.send( true ) },
					{ text: 'weiter beantworten', onPress: () => this.setState( { showMissingAnswers: true } ), style: 'cancel' },
				],
				{ cancelable: false },
			);
			return;
		}
		
		fetch( Config.API_HOST + '/api/foodstudy/log', {
			
			method: 'POST',
			headers: {
				Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + ( await AsyncStorage.getItem( 'jwt' )
				),
			},
			body: JSON.stringify( { data: this.state.answers } ),
			
		} )
			.then( ( response ) => response.json() )
			.then( ( responseJsonFromServer ) => {
				const now = new Date();
				let today = now.getFullYear() +'-'+ now.getMonth() +'-'+ now.getDate();
				const answered = { date: today };
				AsyncStorage.setItem( 'questions-last-answer', JSON.stringify(answered) );
				
				Alert.alert( 'Gesendet!' );
				
			} )
			.catch( ( error ) => {
				console.error( error );
			} );
		
		this.ret();
		
	};
	
	ret = () => {
		const resetAction = StackActions.reset( { index: 0, actions: [ NavigationActions.navigate( { routeName: 'TabNavigator' } ) ] } );
		this.props.navigation.dispatch( resetAction );
	};
	
}

const styles = StyleSheet.create( {
	                                  contentContainer: {
		                                  paddingVertical: 20,
		
	                                  },
	                                  container: {
		                                  flex: 1,
		                                  flexDirection: 'column',
		                                  backgroundColor: '#9c9c9c',
		                                  paddingTop: 5,
		                                  paddingBottom: 5,
		                                  paddingLeft: 5,
		                                  paddingRight: 5,
	                                  },
	                                  boxContainer: {
		                                  flex: 1,
		                                  alignItems: 'center',
		                                  justifyContent: 'center',
		                                  paddingTop: 5,
		                                  paddingBottom: 5,
		                                  paddingLeft: 5,
		                                  paddingRight: 5,
		                                  borderRadius: 5,
		                                  opacity: 5,
		                                  marginBottom: 10,
	                                  },
	                                  boxOne: {
		                                  flex: 3,
		                                  alignSelf: 'center',
		                                  alignItems: 'center',
		                                  justifyContent: 'space-around',
	                                  },
	                                  boxTwo: {
		                                  flex: 1,
		                                  alignItems: 'stretch',
		                                  justifyContent: 'space-between',
		                                  backgroundColor: "#ffffff",
		                                  borderColor: '#000000',
		                                  borderWidth: 1,
		                                  padding: 0,
	                                  },
	
	                                  sliderContainer: {
		                                  flex: 1,
		                                  alignItems: 'stretch',
		                                  paddingTop: 5,
		                                  paddingLeft: 15,
		                                  paddingRight: 15,
		                                  paddingBottom: 0,
	                                  },
	
	                                  textQuestion: {
		                                  alignSelf: 'stretch',
		                                  fontWeight: 'bold',
		                                  fontSize: 18,
		                                  color: '#000000',
		                                  padding: 20,
	                                  },
	
	                                  questionAnswered: {
		                                  color: '#2f6900',
	                                  },
	                                  questionMissing: {
		                                  color: '#ae0303',
	                                  },
	
	
	
	                                  sliderLabelContainer: {
		                                  flexDirection: 'row',
		                                  justifyContent: 'space-between',
		                                  borderColor: '#000000',
		                                  fontSize: 10,
		                                  padding: 0,
	                                  },
	                                  sliderLabel: {
		                                  alignSelf: 'stretch',
		                                  fontSize: 12,
		                                  color: '#000000',
		                                  padding: 0,
	                                  },
	
	
	                                  to: {
		                                  alignSelf: 'stretch',
		                                  alignItems: 'center',
		                                  backgroundColor: "#ffffff",
		                                  padding: 15,
		                                  marginTop: 10,
		                                  opacity: 1,
		                                  borderRadius: 10,
		                                  borderColor: '#000000',
		                                  borderWidth: 2,
	                                  },
	                                  btntext: {
		                                  fontSize: 20,
		                                  color: '#000000',
		
	                                  },
	                                  pickr: {
		                                  alignSelf: 'stretch',
		                                  backgroundColor: '#000000',
		                                  marginBottom: 15,
	                                  },
                                  } );