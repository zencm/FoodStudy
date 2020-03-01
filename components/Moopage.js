import React, { Component } from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {StackActions, NavigationActions, SafeAreaView} from 'react-navigation';
import Profile from "./Profile";

import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';

export default class Moopage extends Component{

    constructor(props){
        super(props);
        this.state = {
            aUser: '',
            mvalue: 50,
        }
    }

    async componentDidMount(){
        let value = await AsyncStorage.getItem('user');
        this.setState({aUser: value});
    }

    send = async () => {

        fetch(Config.API_HOST +'/api/foodstudy/log', {
    
            method: 'POST',
            headers: {Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+ (await AsyncStorage.getItem('jwt'))},
            body: JSON.stringify({
                mood: this.state.mvalue,
            })

        })
            .then((response) => response.json())
            .then((responseJsonFromServer) => {
                Alert.alert('Gesendet!');
            }).catch((error) => {
            console.error(error);
        });
        this.ret();

    };

    ret = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'TabNavigator' })],
        });
        this.props.navigation.dispatch(resetAction);

    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle = {[styles.contentContainer]}>

                    <View style={[styles.boxContainer, styles.boxTwo]}>

                        <Text style={styles.textf}>Stimmung {this.state.mvalue}</Text>

                        <View style={[styles.boxContainer, styles.boxThree]}>
                            <Slider
                                style={{ flex: 1 }}
                                step={1}
                                minimumValue={0}
                                maximumValue={100}
                                value={this.state.mvalue}
                                onValueChange={val => this.setState({ mvalue: val })}
                                onSlidingComplete={ val => this.setState({ mvalue: val })}
                            />
                        </View>

                        <View style={[styles.boxContainer, styles.boxThree]}>
                            <Text style={styles.text}>Sehr schlecht</Text>
                            <Text style={styles.text}>Sehr gut</Text>
                        </View>

                    </View>
                </ScrollView>

                <TouchableOpacity style={styles.to} onPress={() => this.send()}>
                    <Text style={styles.btntext}>Senden</Text>
                </TouchableOpacity>

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
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
    boxContainer:{
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
    boxOne:{
        flex: 3,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    boxTwo:{
        flex: 1,
        alignItems: 'stretch',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
        backgroundColor: "#ffffff",
        borderColor: '#000000',
        borderWidth: 1,
    },
    boxThree: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#000000',
    },
    textf: {
        alignSelf: 'stretch',
        fontWeight: 'bold',
        fontSize: 30,
        color: '#000000',
        padding: 10,
    },

    text: {
        alignSelf: 'stretch',
        fontSize: 20,
        color: '#000000',
        padding: 10,

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
});
