import React from "react";
import { TextInput, StatusBar, View, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, Icon, Text } from 'react-native-elements'
import Header from '../../../shared/Header'
import { secondColor } from '../../../shared/constants'
import { _launchCameraRoll, _takePhoto } from '../../../services/CameraAPI'
import firebase from '../../../services/firebaseConfig'

export default class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        var firebaseDB = firebase.database();
        this.adminID = firebase.auth().currentUser.uid
        this.commKey = this.props.navigation.getParam('communityKey')
        this.roomsRef = firebaseDB.ref('rooms/' + this.props.navigation.getParam('communityKey'));
        this.navigate = this.props.navigation.navigate
        this.state = {
            rooms: [],
            newRoom: '',
            avatar: ''
        }
    }


    pickAvatar = () => {
        let promObject = _launchCameraRoll()
        promObject.then(res => {
            res.url.then(res => {
                this.setState({ avatar: res })
            })
        })
    }

    addRoom = () => {
        if (this.state.newRoom === '') {
            return;
        }
        this.roomsRef.push({
            name: this.state.newRoom,
            avatar: this.state.avatar,
        }).then(res => {
            this.props.navigation.getParam('selMembers').forEach(item => {
                firebase.database().ref(`rooms/${this.commKey}/${res.key}/members/${item.key}`).set({
                    admin: item.key === this.adminID ? true : false
                })
            })
        })
        this.props.navigation.navigate("RoomsList")
        this.setState({ newRoom: '' });
    }

    render() {
        var profileIcon = 'https://www.searchpng.com/wp-content/uploads/2019/02/Deafult-Profile-Pitcher.png'
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header title='New Room' />
                <View style={{ padding: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            rounded
                            showEditButton
                            onEditPress={this.pickAvatar}
                            size={'large'}
                            icon={{ name: 'user', type: 'font-awesome' }}
                            source={{ uri: this.state.avatar ? this.state.avatar : profileIcon }}
                        />
                    </View>
                    <TextInput
                        style={styles.newRoomTextInput}
                        placeholder="Enter Room Name"
                        autoCapitalize="none"
                        value={this.state.newRoom}
                        onChangeText={newRoom => this.setState({ newRoom })}
                    />
                    <TouchableOpacity style={styles.addMembers} onPress={() => this.navigate('ChooseRoomMembers', { commKey: this.commKey })}>
                        <Icon type='font-awesome' name='plus' size={25} color={'#555'} />
                        <Text style={styles.addMembersTxt}>Add Members</Text>
                    </TouchableOpacity>
                    <View style={{ marginBottom: 5 }}>
                        <Button title="Create" color={secondColor} onPress={() => this.addRoom()} />
                    </View>
                    <FlatList
                        style={{ paddingHorizontal: 8, height: 150 }}
                        data={this.props.navigation.getParam('selMembers')}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) => (
                            <View style={styles.list}>
                                <Avatar rounded source={{ uri: item.avatar }} size={48} />
                                <Text style={{ fontSize: 18, marginLeft: 10 }}>{item.name}</Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    newRoomTextInput: {
        borderWidth: 1,
        borderColor: secondColor,
        padding: 5,
        marginBottom: 5,
        borderRadius: 2
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    addMembers: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    },
    addMembersTxt: {
        fontSize: 23,
        color: '#555',
        marginLeft: 5
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#BBB',
    }
});


