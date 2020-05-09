import React, { Component } from 'react'
import { Text, View, Button, Alert, TextInput } from 'react-native'
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
            RoomName: '',
            msgToBubble: 'MY First Bubble',
            userId: 'userId' + (Math.floor(Math.random() * (999999 - 100000) + 100000))
        }
    }
    handleSignInButton = () => {
        this.signInToFirebase(this.state.email, this.state.password)
    }

    async signInToFirebase(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password)
            Alert.alert(this.state.email, 'logged in successfully')
            this.getUser()
        }
        catch (error) {
            Alert.alert(error)
        }
    }

    async getUser() {
        try {
            let user = await firebase.auth().currentUser.uid
            this.setState({ userId: user })
        }
        catch (e) { console.log(e) }
    }

    handleRoomName = (name) => {
        this.setState({ RoomName: name })
    }
    handleMsg = (msg) => { this.setState({ msgToBubble: msg }) }

    navigationToCreateBubble = () => {
        const { navigate } = this.props.navigation
        const { RoomName, msgToBubble, userId } = this.state

        navigate('createBubble', { RoomName: RoomName, msgToBubble: msgToBubble, userId: userId })
    }

    navigationToBubble = () => {
        const { navigate } = this.props.navigation
        const { RoomName, msgToBubble, userId } = this.state

        navigate('Bubble', { RoomName: RoomName, msgToBubble: msgToBubble, userId: userId })
    }


    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={{ textAlign: 'center', flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>
                    {this.state.RoomName}
                </Text>
                <TextInput
                    placeholder='msg'
                    onChangeText={(msg) => this.handleMsg(msg)}
                    style={{ width: 250, borderWidth: 1, margin: 5 }} />
                <Button
                    title='create Bubbles'
                    onPress={this.navigationToCreateBubble}
                />
                <Button
                    title='go to Bubble'
                    onPress={this.navigationToBubble}
                />
            </View>
        )
    }
}