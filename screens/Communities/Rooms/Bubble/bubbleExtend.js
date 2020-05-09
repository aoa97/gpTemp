import React, { Component } from "react";
import { View, Text,Button, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, ScrollView } from "react-native";
import { Comment } from "./comments";
import * as firebase from "firebase";



export default class bubbleExtend extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedPostId: 0,
            userName: '',
            bubble: '',
            comments: [],
            BubbleDetails: [],
            likes: 0,
            userId : ''

        }
    }


    UNSAFE_componentWillMount() {
        const { params } = this.props.navigation.state
        this.setState({ selectedPostId: params.selectedPostId, bubble: params.msgToBubble, likes: params.likes, userId: params.userId })
        this.receiveComments.bind(this)
    }

    /*   updateState = () => {
           let myList = list[this.state.selectedPostId]
           this.setState({
               userName: myList.userName,
               bubble: myList.bubble,
               likes: myList.likes,
               comments: commentSample.length,
           })
       }*/

    async receiveComments() {

        let comments = []
        let address = 'communities/rooms/ahmad/Bubbles/' + this.state.selectedPostId + '/Comments'
        await firebase.database().ref(address).on('value', snap => {
            snap.forEach(child => {
                comments.push({
                    key: child.key,
                    comment: child.val().comment,
                    userId: child.val().userId,
                    timestamp: child.val().timestamp
                })
            })
        })
        this.setState({ comments: comments })
        
    }

    render() {
        let avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRjiFixXCtFlh6Shlj89HpmVUZTQDvHwhIqJv75dCELlTPryUkYQ&s'
        return (
            <ScrollView style={styles.container} >
                <View>
                    <TouchableOpacity style={styles.bubblee} onPress={this.receiveComments.bind(this)}   >
                        <Image source={{ uri: avatar }} style={styles.image} />
                        <Text style={styles.Username}>{this.state.userId}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.Bubble}>
                    <Text>{this.state.bubble}</Text>
                </TouchableOpacity>
                <View style={styles.fixToText}>
                    <TouchableOpacity>
                        <Text>{this.state.likes} Likes </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text> {this.state.comments.length} Comments </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <FlatList
                        data={this.state.comments}
                        renderItem={({ item }) => (
                            <Comment
                                id={item.id}
                                comment={item.comment}
                            />
                        )
                        }
                    />
                    <TextInput placeholder='add comment' style={styles.commentSection} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        borderRadius: 15
    },
    container: {
        margin: 2,
        padding: 5,
        backgroundColor: '#E2E2E2',
        borderRadius: 15,
        paddingTop: 25
    },
    bubblee: {
        flexDirection: 'row',
        paddingLeft: 5,
        paddingTop: 5,


    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        paddingBottom: 15
    },
    Username: {
        fontSize: 14,
        color: 'brown',
        paddingTop: 5,
        paddingLeft: 10
    },
    Bubble: {
        color: '#5e64c1',
        paddingTop: 15,
        paddingLeft: 5,
    },
    commentSection: {
        padding: 10,
        borderRadius: 15,
        borderColor: '#d3d3d3',
        borderWidth: 1,
        marginBottom: 5
    }
})      