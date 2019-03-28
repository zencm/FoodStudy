import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';

export default class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    componentDidMount(){
        this._loadInitilalState().done();
    }

    _loadInitilalState = async () => {

        const value = await AsyncStorage.getItem('user');
        if (value !== null) {
            this.props.navigation.navigate('Profile');
        }

    };

    // registration = () =>{
    //
    //     const { username }  = this.state ;
    //     const { password }  = this.state ;
    //
    //     fetch('https://beispiel.server.de/User_Registration.php/', {
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

        if(
            (this.state.username === '' && this.state.password === '') ||
            (this.state.username === '' && this.state.password !== '') ||
            (this.state.password === '' && this.state.username !== '')

        ){
            Alert.alert('Hinweis!','Bitte Benutzernamen und Passwort eingeben');
        } else {

            fetch('https:beispiel.server.de/User_Login.php/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    if(responseJson === 'Data Matched'){
                        AsyncStorage.setItem('user', this.state.username);
                        this.props.navigation.navigate('Profile');
                    }

                    else{
                        Alert.alert('Hinweis!',responseJson);
                    }

                }).catch((error) => {
                console.error(error);
            });
        }

    };

    render() {
        return (
            <View style={styles.container}>

                <View style={[styles.boxContainer, styles.boxOne]}>
                    <Text style={styles.header}>- Willkommen -</Text>
                </View>

                <View style={[styles.boxContainer, styles.boxTwo]}>
                    <TextInput
                        style={styles.textInput} placeholder='Benutzername'
                        onChangeText={ (text) => this.setState({username: text}) }
                        value={this.state.username}
                        underlineColorAndroid='transparent'
                    />

                    <TextInput
                        style={styles.textInput} placeholder='Passwort'
                        onChangeText={ (text) => this.setState({password: text}) }
                        secureTextEntry={true} underlineColorAndroid='transparent'
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

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    boxContainer:{

        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 5,
        opacity: 5,
    },
    boxOne:{

        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 50,
    },
    boxTwo:{
        marginTop: 50,
        alignItems: 'stretch',
        justifyContent: 'space-around',

    },
    boxThree: {
        marginTop: 50,
        alignItems: 'stretch',
        justifyContent: 'flex-end',
    },
    header: {
        fontSize: 30,
        color: '#373737',
        fontWeight: 'bold',
    },
    textInput: {

        padding: 16,
        borderColor: '#000000',
        borderWidth: 1,
        marginBottom: 15,
    },
    to: {
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: "#fff",
        padding: 15,
        opacity: 1,
        marginTop: 20,
        borderRadius: 10,
        borderColor: '#000000',
        borderWidth: 2,
    },
    btntext: {
        fontSize: 20,
        color: '#373737',
        fontWeight: 'bold',

    },
});