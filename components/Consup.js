import React, { Component } from 'react';
import {AsyncStorage, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';



export default class Consup extends Component{

    constructor(props){
        super(props);
        this.state = {
            aUser: '',
            sleep: '',
            mood: '',
            digestion:'',
            url: 'https://beispiel.server.de/Anleitung.php',
            url2: 'https://beispiel.server.de/datenschutz.php',
        }
    }

    async componentDidMount(){
        let value = await AsyncStorage.getItem('user');
        this.setState({aUser: value});
    }

    handleClick = () => {
        Linking.canOpenURL(this.state.url).then(supported => {
            if (supported) {
                Linking.openURL(this.state.url);
            } else {
                console.log("Don't know how to open URI: " + this.state.url);
            }
        });
    };

    handleClick2 = () => {
        Linking.canOpenURL(this.state.url2).then(supported => {
            if (supported) {
                Linking.openURL(this.state.url2);
            } else {
                console.log("Don't know how to open URI: " + this.state.url2);
            }
        });
    };

    // logout = () => {
    //     this.setState({aUser: ''});
    //     AsyncStorage.setItem('user','');
    //     const { navigate } = this.props.navigation;
    //     navigate('Login', {
    //         aUser: '',
    //     })
    // };

    render() {
        return (
            <View style={styles.container}>

                <ScrollView contentContainerStyle = {[styles.contentContainer]}>

                    <View style={[styles.boxContainer, styles.boxTwo]}>
                        <TouchableOpacity onPress={this.handleClick}>
                            <Text style={styles.text2}>Anleitung:</Text>
                            <Text style={styles.text}>{this.state.url}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.boxContainer, styles.boxTwo]}>
                        <TouchableOpacity onPress={this.handleClick2}>
                            <Text style={styles.text2}>Kontakt</Text>
                            <Text style={styles.text}>Phone: 0451 3101 3611</Text>
                            <Text style={styles.text}>Email: annekatrin.muth@uni-luebeck.de</Text>
                        </TouchableOpacity>
                    </View>


                    {/*<View style={[styles.boxContainer, styles.boxTwo]}>*/}
                        {/*<TouchableOpacity onPress={this.logout}>*/}
                            {/*<Text style={styles.text2}>{this.state.aUser}</Text>*/}
                            {/*<Text style={styles.text2}>Logout</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}



                </ScrollView>


            </View>

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
        justifyContent: 'flex-start',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 5,
        opacity: 5,
        marginBottom: 10,
    },
    boxTwo:{
        flex: 1,
        alignItems: 'stretch',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-around',
        backgroundColor: "#ffffff",
        borderColor: '#000000',
        borderWidth: 1,
    },

    text: {
        alignSelf: 'stretch',
        fontSize: 16,
        color: '#373737',

    },
    text2: {
        alignSelf: 'stretch',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#373737',

    },
    to: {
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: "#ffffff",
        padding: 15,
        opacity: 1,
        borderRadius: 10,
        borderColor: '#000000',
        borderWidth: 2,
    },
    btntext: {
        fontSize: 20,
    },
});