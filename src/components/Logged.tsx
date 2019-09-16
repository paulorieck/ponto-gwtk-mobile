import React from 'react';
import {Component} from 'react';
import {View, KeyboardAvoidingView, Image, Text, TouchableOpacity, StyleSheet, TextInput, Alert} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br'

interface FormProps {
    intime: number,
    outtime: number,
    navigation: any
}

class Logged extends Component<FormProps> {

    render() {

        let intime:string = 'Não há registros de entrada.';
        if ( this.props.navigation.getParam('intime') ) {
            intime = moment(new Date(parseFloat(this.props.navigation.getParam('intime')))).locale('pt-br').format('D [de] MMMM [de] YYYY, HH:mm');
        }

        let outtime:string = 'Não há registros de saída.';
        if ( this.props.navigation.getParam('outtime') ) {
            outtime = moment(new Date(this.props.navigation.getParam('outtime'))).locale('pt-br').format('D [de] MMMM [de] YYYY, HH:mm');
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
                        <TouchableOpacity style={styles.buttonContainerInit} >
                            <Text style={styles.buttonText}>Registrar Entrada</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingHorizontal: 20, paddingVertical: 10, flex: 1}}>
                        <Text style={{color: '#ffffff', paddingBottom: 5, fontSize: 10, backgroundColor: 'rgba(225,225,225,0.2)'}}>Notas, se houverem (preencher antes de registrar a saída):</Text>
                        <TextInput style={styles.input}
                            autoCorrect={false} keyboardType='default'
                            returnKeyType="next" placeholder='Notas...' />
                    </View>

                    <View style={{paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 50}}>
                        <TouchableOpacity style={styles.buttonContainerEnd} disabled={true} >
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
        backgroundColor: '#ffffff',
        borderRadius: 5
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
        fontSize:20
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