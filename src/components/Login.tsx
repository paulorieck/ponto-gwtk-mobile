import React from 'react';
import {Component} from 'react';
import {View, KeyboardAvoidingView, Image, StyleSheet, Alert, TextInput, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import http_client from '../api/axios_common_client';

interface FormProps {
    navigation: any;
}

class Login extends Component<FormProps> {

    static SampleVar: string

    state = {
        login: '',
        password: '', 
        errorMessage: null,
        loggedIn: false
    };

    getTimeRegister = () => {

        // Get last time register
        //http_client.post("getUserCredentials.php").then((response) => {
            http_client.post("getLastRegister.php").then((response) => {
                this.props.navigation.navigate('Logged', {id: response.data[0].id, intime: response.data[0].intime, outtime: response.data[0].outtime});
            });
        //});

    }

    storeLogin = () => {

        (async () => {
            try {
                await AsyncStorage.setItem("userData", JSON.stringify({login: this.state.login, password: this.state.password}));
            } catch (error) {
                console.log("Something went wrong", error);
            }
        });

    }

    handleLogin = () => {

        // Do login
        const params = new URLSearchParams();
        params.append('username', this.state.login);
        params.append('password', this.state.password);

        http_client({method: 'post', url: "check_login.php", data: params}).then(response => {

            if ( response.data === "Success" ) {

                this.setState({loggedIn: true});
                this.storeLogin();
                this.getTimeRegister();

            } else {
                Alert.alert("Erro no login, por favor, tente novamente!");
            }

        });
    
    }

    render() {

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={styles.loginContainer}>
                    <Image resizeMode="contain" style={styles.logo} source={require('../images/logo.png')}></Image>
                </View>
                <View style={styles.formContainer}>
                    <View style={{width: '90%'}}>
                        <TextInput style = {styles.input} 
                            autoCapitalize="none" 
                            //onSubmitEditing={() => this.passwordInput.focus()} 
                            onChangeText={(login) => this.setState({login})}
                            autoCorrect={false} 
                            keyboardType='default' 
                            returnKeyType="next" 
                            placeholder='Login' 
                            placeholderTextColor='rgba(225,225,225,0.7)' />

                        <TextInput style = {styles.input}   
                                    //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                                    placeholder='Senha' 
                                    onChangeText={(password) => this.setState({password})}
                                    placeholderTextColor='rgba(225,225,225,0.7)' 
                                    secureTextEntry/>

                        <TouchableOpacity style={styles.buttonContainer} 
                                            onPress={() => this.handleLogin()}>
                            <Text  style={styles.buttonText}>LOGIN</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
        width: '100%'
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
        alignItems: 'center',
        flex: 1,
        flexGrow: 1
    },
    buttonContainer:{
        backgroundColor: '#2980b6',
        paddingVertical: 15,
        borderRadius: 5
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff',
        borderRadius: 5
    }
});



export default Login;