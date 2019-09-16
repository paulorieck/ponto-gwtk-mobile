import React from 'react';
import { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Login from './Login';
import Logged from './Logged';

const AppNavigator = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            title: 'Login'
        }
    },
    Logged: {
        screen: Logged,
        navigationOptions: {
            title: 'Ponto'
        }
    }
},{
    initialRouteName: 'Login',
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
    render() {
        return <AppContainer />        
    }
}