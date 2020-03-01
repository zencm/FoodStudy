import React, {Component} from 'react';
import {ActivityIndicator, Alert,  BackHandler, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, SafeAreaView, StackActions} from 'react-navigation';
import Config from 'react-native-config';

const confood = [];
const foodlist = [];

export default class Endpage extends Component{

    constructor(props){
        super(props);
        this.state = {
            aUser: '',
            fooditem: this.props.navigation.state.params.itemnamee,
            foodkey: this.props.navigation.state.params.itemkeyy,
            datentime: this.props.navigation.state.params.datexxx,
            date: this.props.navigation.state.params.date,
            mealtime: this.props.navigation.state.params.dateyyy,
            persons: this.props.navigation.state.params.personzzz,
            foodeaten: this.props.navigation.state.params.foodchoose,
            foodamount: this.props.navigation.state.params.amfood,
            keyf: '',
            foodsplit: '',
            ActivityIndicator_Loading: false,
            wait: false,
        };
    }

    more = () => {
        const { navigate } = this.props.navigation;
        navigate('Searchfilter',
            {   datex: this.state.datentime,
                datey: this.state.mealtime,
                date: this.state.date,
                personz: this.state.persons,
            });
    };

    send = () => {
        this.setState({ ActivityIndicator_Loading : true }, async () => {
            fetch(Config.API_HOST+'/api/foodstudy/food', {
    
                method: 'POST',
                headers: {Accept: 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+ (await AsyncStorage.getItem('jwt'))},
                
                // bls
                // bls_key
                body: JSON.stringify({
                    date: this.state.date,
                    food: confood.toString(),
                    meal_type: this.state.mealtime,
                    people: this.state.persons,
                })

            })
                .then((response) => response.json())
                .then((responseJsonFromServer) => {
                    Alert.alert('Gesendet!');
                    this.done();

                }).catch((error) => {
                console.error(error);
                 });
        });
    };

    done = () => {

        for (let i = 0; i < confood.length; i++) {
            confood.splice(i);
            foodlist.splice(i);
        }

        if (this.state.mealtime === 'Fruehstueck'){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Slepage' })],
            });
            this.props.navigation.dispatch(resetAction);
        }

        if (this.state.mealtime === 'Abendbrot'){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Digpage' })],
            });
            this.props.navigation.dispatch(resetAction);
        }

        if (this.state.mealtime === 'Mittagessen' || this.state.mealtime === 'Zwischenmahlzeit'){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Moopage' })],
            });
            this.props.navigation.dispatch(resetAction);
        }

    };

    delete = (item) => {
        Alert.alert (
            'Achtung!',
            'Wollen Sie ' + item.toString() + ' wirklich löschen?',
            [
                {text: 'Abbrechen', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Löschen', onPress: () => this.deleteItem(item)},
            ],
            { cancelable: true }
        )
    };

    deleteItem = (item) => {

        for (let i = 0; i < foodlist.length; i++) {
            if (foodlist[i] === item){
                foodlist.splice(i,1);
                confood.splice(i,1);
            }
        }
        this.setState({foodeaten:foodlist});

    };

    comb = () => {
        let x = this.state.foodamount + '_';
        let y = this.state.foodkey;
        let res = x.concat(y);
        confood.push(res);
    };

    async componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        foodlist.push(this.state.foodeaten);
        this.comb();
        let value = await AsyncStorage.getItem('user');
        this.setState({aUser: value});
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => {
        return true;
    };


    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={[styles.boxContainer, styles.boxOne]}>
                    <Text style={styles.text}>Datum: {this.state.datentime}</Text>
                    <Text style={styles.text}>Mahlzeit: {this.state.mealtime}</Text>
                    <Text style={styles.text}>Begleitung: {this.state.persons}</Text>
                </View>

                <View style={[styles.boxContainer, styles.boxTwo]}>
                    <FlatList
                        data={foodlist}
                        extraData={this.state}
                        containerStyle={{ flex: 1 }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) =>

                            <TouchableOpacity style={styles.to2} onPress={() => this.delete(item)}>
                                <Text style={styles.ftext}>{item}</Text>
                            </TouchableOpacity>

                        }
                    />

                </View>

                <View style={[styles.boxContainer, styles.boxThree]}>
                    <TouchableOpacity style={styles.to} onPress={() => this.more()}>
                        <Text style={styles.btntext}>Mehr hinzufügen...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.to} onPress={() => this.send()}>
                        <Text style={styles.btntext}>SENDEN!</Text>
                    </TouchableOpacity>
                </View>

                {
                    this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large' style={styles.ActivityIndicatorStyle} /> : null
                }

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
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
    },
    boxOne:{
        flex: 2,
        alignItems: 'stretch',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#000000',
        borderWidth: 1,
        marginBottom: 10,
    },
    boxTwo:{
        flex: 6,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#000000',
        borderWidth: 1,
        marginBottom: 5,
    },
    boxThree: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 25,

    },
    text: {
        fontSize: 18,
        color: '#373737',
    },
    to: {
        alignSelf: 'stretch', alignItems: 'center', padding: 20,
        justifyContent: "center"
    },
    to2: {
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#373737',
        padding: 20,
        marginBottom: 18,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 1,
    },
    ftext: {
        fontSize: 20,
        color: '#fff',
    },
    btntext: {
        fontSize: 20,
        color: '#373737',
    },
    ActivityIndicatorStyle:{

        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'

    },

});
