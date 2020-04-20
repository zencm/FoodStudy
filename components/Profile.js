import React, { Component } from 'react';
import {Alert, BackHandler, Picker, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/de';
import {SafeAreaView} from 'react-navigation';
import Searchfilter from "./Searchfilter";

export default class Profile extends Component{

    constructor(props){
        super(props);
        this.state = {
            activeUser:'',
            dateText: '',
            dayTime: '',
            person: '',
            cdate: '',
            isDateTimePickerVisible: false,
        }
    }

    pruef = () => {
        const { navigate } = this.props.navigation;
        if (this.state.dateText !== '' &&
            this.state.dayTime !== '' &&
            this.state.person !== ''){
            if(this.state.cdate <= moment()){
                navigate('Searchfilter', {
                    datex: this.state.dateText,
                    datey: this.state.dayTime,
                    date: this.state.cdate,
                    personz: this.state.person,
                })
            }
            else{
                Alert.alert('Datum aus der Zukunft nicht gestattet!')
            }

        }
        else{
            Alert.alert('Achtung!','Bitte Mahlzeit, Begleitung und Datum angeben!')
        }
    };

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        moment.locale('de');
        let formattedDate = moment(date).format('YYYY-MM-DD, HH:mm');
        this.setState({dateText: formattedDate});
        this.setState({cdate: date});
        this._hideDateTimePicker();
    };

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
        const value = await AsyncStorage.getItem('user');
        this.setState({activeUser:value});
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

                {/*<View style={[styles.boxContainer, styles.boxOne]}>
                    <Text style={styles.text}>Datum: {this.state.dateText}</Text>
                    <Text style={styles.text}>Mahlzeit: {this.state.dayTime}</Text>
                    <Text style={styles.text}>Begleitung: {this.state.person}</Text>
                </View>*/}

                <View style={[styles.boxContainer, styles.boxTwo, styles.mainContainer]}>
    
                    <TouchableOpacity style={styles.to2} onPress={this._showDateTimePicker}>
                        <Text style={styles.text}>{ this.state.dateText ? `Datum: ${this.state.dateText}` : 'Datum & Uhrzeit'}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                        mode="datetime"
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                    />
                    
                    <Text style={styles.text2}>Mahlzeit:</Text>
                    <Picker
                        style={styles.pickr}
                        mode="dropdown"
                        selectedValue = {this.state.dayTime}
                        onValueChange = {(daytime) => this.setState({ dayTime: daytime })}>
                        <Picker.Item label = "" value = "" />
                        <Picker.Item label = "Fruehstueck" value = "Fruehstueck" />
                        <Picker.Item label = "Mittagessen" value = "Mittagessen" />
                        <Picker.Item label = "Abendbrot" value = "Abendbrot" />
                        <Picker.Item label = "Zwischenmahlzeit" value = "Zwischenmahlzeit" />
                    </Picker>
    
                    <Text style={styles.text2}>Begleitung:</Text>
                    <Picker
                        style={styles.pickr}
                        selectedValue = {this.state.person}
                        onValueChange = {(person) => this.setState({ person: person })}>
                        <Picker.Item label = "" value = "" />
                        <Picker.Item label = "Alleine unbeschaeftigt" value = "0" />
                        <Picker.Item label = "Alleine beschaeftigt" value = "1" />
                        <Picker.Item label = "Zu Zweit" value = "2" />
                        <Picker.Item label = "Mehr als Zwei" value = "3" />
                    </Picker>

                </View>

                <View style={[styles.boxContainer, styles.boxThree]}>
                    <TouchableOpacity
                        style={styles.to}
                        onPress={() => this.pruef()}>
                        <Text style={styles.btntext}>WEITER</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
                                     mainContainer:{
                                     
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
        marginBottom: 5,
    },
    boxTwo:{
        flex: 6,
        alignItems: 'stretch',
        justifyContent: 'space-around',
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
        borderWidth: 2,
        backgroundColor: "#ffffff",
        borderColor: '#000000',
        borderRadius: 25,
    },
    text: {
        fontSize: 18,
        color: '#373737',
    },
    text2: {
        fontSize: 18,
        alignSelf: 'stretch',
marginTop: 50,
    },
    to: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20,
    },
    to2: {
        alignItems: 'center',
        padding: 15,
        borderColor: '#000000',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 15,
    },
    btntext: {
        fontSize: 20,
        justifyContent:'center',
        color: '#373737',
    },
    pickr: {
        alignSelf: 'stretch',

    },
});
