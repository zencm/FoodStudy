import React, { Component } from "react";
import { BackHandler, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import SearchableFlatlist from "searchable-flatlist";
import food from './foodlist';

const data = food;

export default class Searchfilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            datentime: this.props.navigation.state.params.datex,
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
            <View style={sContainer}>
                <TextInput
                    placeholder={"Suche"}
                    style={sSearchBar}
                    onChangeText={searchTerm => this.setState({ searchTerm })}
                />
                <SearchableFlatlist
                    searchProperty={"name"}
                    searchTerm={this.state.searchTerm}
                    data={data}
                    containerStyle={{ flex: 1 }}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) =>

                        <TouchableOpacity
                            style={styles.to}
                            onPress={() => navigate('Amountchoose',
                                {   itemname: item.name,
                                    itemkey: item.blsKey,
                                    datexx: this.state.datentime,
                                    dateyy: this.state.mealtime,
                                    personzz: this.state.persons,
                                })}>
                            <Text style={sTextItem}>{item.name}</Text>
                        </TouchableOpacity>

                    }

                />
            </View>
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
        backgroundColor: "#373737",
        padding: 10,
        margin: 10,
        marginTop: 10,
        borderRadius: 5,
        borderColor: '#000000',
        borderWidth: 1,
    },
    sTextItem: {
        height: 50,
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
    }
});