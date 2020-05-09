import React, { Component } from "react";
import { View, Button, TextInput, Alert } from "react-native";
import * as firebase from "firebase";

export default class createBubble extends React.Component {
    constructor() {
        super()
        this.state = {
            RoomName: '',
            msgToBubble: '',
            userId: 0,
            comment: 'hi',
            sentMsg: true
        }
    }
    UNSAFE_componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({
            RoomName: params.RoomName,
            msgToBubble: params.msgToBubble,
            userId: params.userId
        })
    }

    updateToDatabase = () => {
        const { RoomName, msgToBubble, userId, comment } = this.state
        let route = 'communities/rooms/' + RoomName + '/Bubbles'
        let sentMsg = this.state.sentMsg? userId : ''
        console.log(firebase.database.ServerValue.TIMESTAMP)
        firebase.database().ref(route).push({
            RoomName,
            msgToBubble,
            userId,
            sentMsg: sentMsg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then((res) => {
            let result = JSON.stringify(res)
            let addressArray = result.split('/')
            let fullAddress = addressArray[7] // index of the folder in the firebase
            let l = fullAddress.length
            let address = fullAddress.substr(0, l - 1)
            let Likes = '/Likes'
            let Comments = '/Comments'
            let likeAddress = route + '/' +address + Likes 
            let commentAddress =route + '/' +address + Comments
            
            firebase.database().ref(likeAddress).set({
                userId: userId,
            })
            
            firebase.database().ref(commentAddress).push({
                userId: userId,
                comment: comment,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            })

            firebase.database().ref(commentAddress).push({
                userId: userId,
                comment: comment,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            })

                

        }).catch((error) => {
            //error callback
            console.log('error ', error)
        })
    }

    handleComments = (comment) => {
        this.setState({ comment: comment })
    }

    render() {
        return (
            <View>
                <Button title='createBubble' onPress={this.updateToDatabase} />
            </View>
        )
    }
}

/*
firebase.database().ref(communites/rooms/${roomName}/Bubbles).on('value', snap => {
    var bubbles = []
    snap.forEach(child => {
        bubbles.push({
            key: child.key,
            RoomName: child.val().RoomName,
        })
    })
    this.setState({ bubbles })
})
 */