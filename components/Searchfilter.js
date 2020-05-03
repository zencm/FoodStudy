import React, {Component} from 'react';
import {BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-navigation';

// import food from './foodlist';
const food = require( '../data/food.json');

import SearchableFlatlist from './SearchableFlatlist';

const data = food;

export default class Searchfilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            datentime: this.props.navigation.state.params.datex,
            date: this.props.navigation.state.params.date,
            mealtime: this.props.navigation.state.params.datey,
            persons: this.props.navigation.state.params.personz,
            searchTerm: "",
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    onBackButtonPressAndroid = () => {
        return true;
    };

    render() {
        const { navigate } = this.props.navigation;
        let { sContainer, sSearchBar, sTextItem } = styles;
        return (
            <SafeAreaView style={sContainer}>
                <TextInput
                    placeholder={"Suche nach Nahrungsmittel"}
                    style={sSearchBar}
                    autoCorrect={false}
                    onChangeText={searchTerm => this.setState({ searchTerm })}
                    autoFocus={true}
                />
                <SearchableFlatlist
                    searchProperty={'de'}
                    searchTerm={this.state.searchTerm}
                    data={data}
                    containerStyle={{ flex: 1 }}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) =>

                        <TouchableOpacity
                            style={styles.to}
                            onPress={() => navigate('Amountchoose',
                                {   itemname: item.de,
                                    itemkey: item.key,
                                    datexx: this.state.datentime,
                                    dateyy: this.state.mealtime,
                                    date: this.state.date,
                                    personzz: this.state.persons,
                                })}>
                            <Text style={sTextItem}>{item.de}</Text>
                        </TouchableOpacity>

                    }

                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    
    sContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    to: {
        alignSelf: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#373737",
        padding: 0,
        margin: 10,
        marginTop: 10,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 1,
    },
    sTextItem: {
        height: 50,
        padding: 10,
        width: "100%",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 18,
        color: "#fff",
    },
    sSearchBar: {
        paddingHorizontal: 10,
        margin: 10,
        marginBottom: 20,
        marginTop: 20,
        height: 50,
        fontSize: 18,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 3,
    
        color: '#333333'
    
    }
});
