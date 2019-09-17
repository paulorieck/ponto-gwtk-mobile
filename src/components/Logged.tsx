import React from 'react';
import {Component} from 'react';
import {View, KeyboardAvoidingView, Image, Text, TouchableOpacity, StyleSheet, TextInput, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import 'moment/locale/pt-br';
import http_client from '../api/axios_common_client';

interface FormProps {
    intime: number,
    outtime: number,
    navigation: any,
    position: Object
}

class Logged extends Component<FormProps> {

    state = {
        id: parseFloat(this.props.navigation.getParam('id')) || 0,
        notes: '',
        intime: parseFloat(this.props.navigation.getParam('intime')) || 0,
        outtime: parseFloat(this.props.navigation.getParam('outtime')) || 0
    }

    sendInitRegister = (params:URLSearchParams) => {

        http_client({method: 'post', url: "initRegister.php", data: params}).then(response => {
            if ( response.data === 1 ) {
                http_client.post("getLastRegister.php").then((response) => {
                    this.setState({id: response.data[0].id, intime: new Date(parseFloat(response.data[0].intime)), outtime: new Date(parseFloat(response.data[0].outtime))});
                });
            }
        });

    };

    registerInit = () => {

        Geolocation.getCurrentPosition((position) => {

            const params = new URLSearchParams();
            params.append('notes', this.state.notes);
            params.append('inlocation', JSON.stringify(position.coords));

            this.sendInitRegister(params);
            
        },(error) => {

            const params = new URLSearchParams();
            params.append('notes', this.state.notes);
            params.append('inlocation', "");

            this.sendInitRegister(params);

        }, { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 });

    };

    sendStopRegister = (params:URLSearchParams) => {

        http_client({method: 'post', url: "stopRegister.php", data: params}).then(response => {
            if ( response.data === 1 ) {
                http_client.post("getLastRegister.php").then((response) => {
                    this.setState({id: response.data[0].id, intime: new Date(parseFloat(response.data[0].intime)), outtime: new Date(parseFloat(response.data[0].outtime))});
                });
            }
        });

    }

    registerEnd = () => {

        Geolocation.getCurrentPosition((position) => {

            const params = new URLSearchParams();
            params.append('notes', this.state.notes);
            params.append('outlocation', JSON.stringify(position.coords));

            this.sendStopRegister(params);
            
        },(error) => {

            const params = new URLSearchParams();
            params.append('id', this.state.id.toString());
            params.append('notes', this.state.notes);
            params.append('outlocation', "");

            this.sendStopRegister(params);

        }, { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 });

    };

    isToday = (dms:number) => {
        return (new Date(dms)).setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0) ? true : false;
    }

    render() {

        let intime:string;
        let outtime:string;
        let init_status:boolean;
        let out_status:boolean;

        if ( !this.state.intime ) {
            intime = "Não há registros de entrada.";
            init_status = false;
        } else {
            if ( this.isToday(this.state.intime) ) {
                init_status = true;
            } else {
                init_status = false;
                out_status = false;
            }
            intime = moment(new Date(this.state.intime)).locale('pt-br').format('D [de] MMMM [de] YYYY, HH:mm');
        }

        if ( !this.state.outtime ) {
            outtime = "Não há registros de saída.";
            out_status = false;
        } else {
            if ( this.isToday(this.state.outtime) ) {
                out_status = true;
            } else {
                out_status = false;
            }
            outtime = moment(new Date(this.state.outtime)).locale('pt-br').format('D [de] MMMM [de] YYYY, HH:mm');
        }

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={styles.loginContainer}>
                    <Image resizeMode="contain" style={styles.logo} source={require('../images/logo.png')}></Image>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Registro de ponto</Text>
                    <Text style={styles.regular_text}>O último registro de entrada se deu em:</Text>
                    <Text style={styles.date_text}>{intime}</Text>
                    <Text style={styles.regular_text}>O último registro de saída se deu em:</Text>
                    <Text style={styles.date_text}>{outtime}</Text>
                    <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                        <TouchableOpacity style={styles.buttonContainerInit} disabled={init_status} onPress={() => this.registerInit()} >
                            <Text style={styles.buttonText}>Registrar Entrada</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingHorizontal: 20, paddingVertical: 10, flex: 1}}>
                        <Text style={{color: '#ffffff', paddingBottom: 5, fontSize: 10}}>
                            Notas, se houverem (preencher antes de registrar a saída):
                        </Text>
                        <TextInput style={styles.input}
                            autoCorrect={false} keyboardType='default'
                            returnKeyType="next" placeholder='Notas...'
                            onChangeText={(notes) => this.setState({notes})}
                            multiline={true} numberOfLines={10} />
                    </View>
                    <View style={{paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 50}} >
                        <TouchableOpacity style={styles.buttonContainerEnd} disabled={out_status} onPress={() => this.registerEnd()} >
                            <Text style={styles.buttonText}>Registrar Saída</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )

    }

}

// define your styles
const styles = StyleSheet.create({
    input: {
        lineHeight: 15,
        flex: 2,
        textAlignVertical: 'top',
        backgroundColor: 'rgba(225,225,225,0.2)',
        borderRadius: 5,
        color: '#ffffff'
    },
    regular_text: {
        paddingHorizontal:20,
        paddingVertical:5,
        color: '#ffffff'
    },
    date_text: {
        paddingHorizontal:40,
        paddingVertical:5,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    buttonText: {
        fontSize:20,
        color: '#ffffff'
    },
    title: {
        fontSize: 40,
        paddingHorizontal: 20,
        paddingVertical:5,
        color: '#ffffff',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    loginContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
    },
    formContainer: {
        flexGrow: 1
    },
    buttonContainerInit:{
        backgroundColor: '#14aa69',
        paddingVertical: 15,
        paddingHorizontal:20,
        borderRadius: 5
    },
    buttonContainerEnd:{
        backgroundColor: '#b53b3b',
        paddingVertical: 15,
        paddingHorizontal:20,
        borderRadius: 5
    }
});

export default Logged;