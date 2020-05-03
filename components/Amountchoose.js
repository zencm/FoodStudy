import React, { Component } from 'react';
import { Alert, BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationActions, SafeAreaView } from 'react-navigation';


export default class Amountchoose extends Component {
	
	constructor( props ){
		super(props);
		this.state = {
			texti    : '',
			texti2   : '0',
			fooditem : this.props.navigation.state.params.itemname,
			foodkey  : this.props.navigation.state.params.itemkey,
			datentime: this.props.navigation.state.params.datexx,
			date: this.props.navigation.state.params.date,
			mealtime : this.props.navigation.state.params.dateyy,
			persons  : this.props.navigation.state.params.personzz,
		};
	}
	
	onChange( text ){
		let newText = '';
		let numbers = '.0123456789';
		
		for ( let i = 0; i < text.length; i++ ){
			if ( numbers.indexOf(text[i]) > -1 ){
				newText = newText + text[i];
			}
		}
		this.setState({texti: newText});
		
		if ( newText === '' ){
			this.setState({texti2: '0'});
		} else{
			this.setState({texti2: newText});
		}
	}
	
	pushAmount = () => {
		const {navigate} = this.props.navigation;
		
		if ( this.state.texti !== '' ){
			let strInt = this.state.texti.toString();
			let foodStr = this.state.fooditem;
			navigate('Endpage', {
				itemnamee: this.state.fooditem,
				itemkeyy: this.state.foodkey,
				datexxx: this.state.datentime,
				date: this.state.date,
				dateyyy: this.state.mealtime,
				personzzz: this.state.persons,
				
				amfood: strInt,
				foodchoose: foodStr,
			});
		} else{
			Alert.alert('', 'Bitte geben Sie eine Menge für Ihre Mahlzeit an');
		}
	};
	
	goBack = () => {
		const backAction = NavigationActions.back({
			key: null,
		});
		this.props.navigation.dispatch(backAction);
	};
	
	componentDidMount(){
		BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
	}
	
	componentWillUnmount(){
		BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
	}
	
	onBackButtonPressAndroid = () => {
		return false;
	};
	
	render(){
		return (
			
			<SafeAreaView style={styles.container}>
				
				<View style={[styles.boxContainer, styles.boxOne]}>
					<Text style={styles.text}>Datum: {this.state.datentime}</Text>
					<Text style={styles.text}>Mahlzeit: {this.state.mealtime}</Text>
					<Text style={styles.text}>Begleitung: {this.state.persons}</Text>
				</View>
				
				<View style={[styles.boxContainer, styles.boxTwo]}>
					
					<View>
						<Text style={[styles.text2,{textAlign: 'center'}]}>Menge für {this.state.fooditem}</Text>
						<Text style={[styles.text2,{textAlign: 'center', marginTop: 10}]}>{this.state.texti2} ( g/ml ) </Text>
					</View>
					
					<TextInput
						style={styles.textInput}
						placeholder="Gramm bzw. Milliliter"
						keyboardType='numeric'
						maxLength={4}
						onChangeText={( text ) => this.onChange(text)}
						value={this.state.texti}
						returnKeyType='done'
						autoFocus={true}
					/>
				
				</View>
				
				<View style={[styles.boxContainer, styles.boxThree]}>
					
					<TouchableOpacity style={styles.to} onPress={() => this.goBack()}>
						<Text style={styles.btntext}>ZURÜCK</Text>
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.to} onPress={() => this.pushAmount()}>
						<Text style={styles.btntext}>OK!</Text>
					</TouchableOpacity>
				</View>
			
			</SafeAreaView>
		
		);
	}
}

const styles = StyleSheet.create({
	container      : {
		flex: 1, flexDirection: 'column', backgroundColor: '#9c9c9c', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5,
	}, boxContainer: {
		flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5, borderRadius: 5, opacity: 5,
	}, boxOne      : {
		flex: 2, alignItems: 'stretch', backgroundColor: '#fff', justifyContent: 'space-around', paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15, borderColor: '#000000', borderWidth: 1, marginBottom: 5,
	}, boxTwo      : {
		flex: 6, alignItems: 'stretch', justifyContent: 'center', backgroundColor: '#fff', paddingTop: 15, paddingBottom: 15, paddingLeft: 40, paddingRight: 40, borderColor: '#000000', borderWidth: 1, marginBottom: 5,
	}, boxThree    : {
		flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderWidth: 2, borderColor: '#000000', borderRadius: 25,
		
	}, text        : {
		fontSize: 18, color: '#373737',
	}, text2       : {
		fontSize: 30, alignSelf: 'stretch', color: '#373737',
	}, textInput   : {
		color: '#333333',
		alignSelf: 'stretch', fontSize: 18, borderWidth: 1, borderColor: '#000000', borderRadius: 5, padding: 10, marginTop: 50
	}, to          : {
		alignSelf: 'stretch', alignItems: 'center', padding: 0,justifyContent: "center"
	}, btntext     : {
		fontSize: 20, color: '#373737', padding: 20
	},
});
