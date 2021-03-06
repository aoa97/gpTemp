import React, { Component } from 'react'
import { Text, View, Button, Alert } from 'react-native'
import * as firebase from 'firebase'


var firebaseConfig = {
    apiKey: "AIzaSyABjDdiaYm83rEkUsEG-u5aeegZrhNDSKs",
    authDomain: "family-social-communicat-b54bb.firebaseapp.com",
    databaseURL: "https://family-social-communicat-b54bb.firebaseio.com",
    projectId: "family-social-communicat-b54bb",
    storageBucket: "family-social-communicat-b54bb.appspot.com",
    messagingSenderId: "954697433619",
    appId: "1:954697433619:web:24ed30743d12f703e835e6"
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = firebase.auth()

export default class Room extends Component {
    constructor() {
        super();
        this.state = {
            email: 'firestorage@gmail.com',
            password: '1234567890',
            RenderedText: 'Room screen'
        }
    }
    handleSignInButton = () => {
        this.signInToFirebase(this.state.email, this.state.password)
    }

    async signInToFirebase(email, password) {
        const { navigate } = this.props.navigation;
        try {
            await auth.signInWithEmailAndPassword(email, password)
            Alert.alert(this.state.email, 'logged in successfully')
            navigate('launchBot')
        }
        catch (error) {
            Alert.alert(error)
        }

    }

    signInToFirebase() {
        const { navigate } = this.props.navigation
        navigate('launchBot')
    }
    render() {
        return (
            <View style={{ textAlign: 'center', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>
                    {this.state.RenderedText}
                </Text>

                <Button
                    title='launch bot'
                    onPress={this.handleSignInButton} />


            </View>
        )
    }
}