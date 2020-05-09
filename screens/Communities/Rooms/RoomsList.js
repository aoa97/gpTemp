import React from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Avatar } from 'react-native-elements'
import Header from '../../../shared/Header'
import firebase from '../../../services/firebaseConfig'

export default class RoomsList extends React.Component {
    constructor(props) {
        super(props);
        var firebaseDB = firebase.database();
        this.communityKey = this.props.navigation.getParam('communityKey')
        this.roomsRef = firebaseDB.ref('rooms/' + this.communityKey).orderByChild('name');
        this.state = {
            rooms: [],
            newRoom: ''
        }
    }

    openMessages(room) {
        this.props.navigation.navigate('ChatScreen', {
            roomKey: room.key,
            roomName: room.name,
            roomAvatar: room.avatar,
            communityKey: this.communityKey
        });
    }

    componentDidMount() {
        this.listenForRooms(this.roomsRef);
    }

    listenForRooms(roomsRef) {
        roomsRef.on('value', (dataSnapshot) => {
            var roomsFB = [];
            dataSnapshot.forEach((child) => {
                roomsFB.push({
                    name: child.val().name,
                    avatar: child.val().avatar,
                    key: child.key
                });
            });
            this.setState({ rooms: roomsFB });
        });
    }

    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
                <Header
                    title="Rooms"
                    icon='plus' type='font-awesome'
                    onPress={() => this.props.navigation.navigate('CreateRoom', { communityKey: this.communityKey })}
                />
                <FlatList
                    data={this.state.rooms}
                    renderItem={({ item }) =>
                        <View style={styles.container}>
                            <Avatar rounded size={65} source={{ uri: item.avatar }} />
                            <View underlayColor="#fff" style={styles.item}>
                                <Text style={styles.roomName}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
                                    <TouchableOpacity onPress={() => this.openMessages(item)}>
                                        <Text style={styles.option}>Chat</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => alert('Chatbot')}>
                                        <Text style={styles.option}>Chatbot</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('BubbleStack')}>
                                        <Text style={styles.option}>Bubble</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#EEE',
        alignItems: 'center',
        paddingLeft: 25,
        paddingVertical: 15,
        marginBottom: 10
    },
    item: {
        marginLeft: 10
    },
    roomName: {
        fontSize: 21,
        fontWeight: 'bold'
    },
    option: {
        fontSize: 16,
        color: 'blue',
        marginRight: 15,
    }
})
