import React from 'react'
import { View, Text, StatusBar, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import Header from '../../../shared/Header'
import firebase from '../../../services/firebaseConfig'

export default class ChooseRoomMembers extends React.Component {
    constructor(props) {
        super(props)
        this.navigate = this.props.navigation.navigate
        this.commKey = this.props.navigation.getParam('commKey')
        this.db = firebase.database()
        this.currentUser = firebase.auth().currentUser
        this.state = {
            communityMembers: [],
            selMembers: [],
            selected: false,
        }
    }

    componentDidMount() {
        this.db.ref(`communities/${this.commKey}/members`).on('value', snap => {
            var communityMembers = []
            snap.forEach(child => {
                this.db.ref(`authenticatedUsers/${child.key}`).on('value', snap => {
                    if (child.key !== this.currentUser.uid) {
                        communityMembers.push({
                            key: snap.key,
                            name: snap.val().fullName,
                            avatar: snap.val().avatar,
                        })
                    }
                })
            })
            this.setState({ communityMembers })
        })
    }

    selectItem = (user) => {
        this.setState({
            //selected: !this.state.selected,
            selMembers: [...this.state.selMembers, { key: user.key, name: user.name, avatar: user.avatar }]
        })
    }

    goBack = () => {
        var members = this.state.selMembers
        members.push({
            avatar: this.currentUser.photoURL,
            key: this.currentUser.uid,
            name: this.currentUser.displayName
        })
        this.navigate('CreateRoom', { selMembers: this.state.selMembers })
    }

    render() {
        const renderUser = (item) => (
            <TouchableOpacity style={[styles.item, { backgroundColor: this.state.selected ? '#DDD' : '#FFF' }]} onPress={() => this.selectItem(item)}>
                <Avatar rounded size="medium" source={{ uri: item.avatar }} />
                <View>
                    <Text style={styles.memberName}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header
                    title="Choose Members .."
                    icon='done' type='material'
                    onPress={this.goBack}
                />
                <FlatList
                    style={{ padding: 6 }}
                    data={this.state.communityMembers}
                    extraData={this.state.selected}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => renderUser(item)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        borderColor: '#AAA',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberName: {
        fontSize: 20,
        marginLeft: 15,
        letterSpacing: 1
    },
    memberStatus: {
        fontSize: 17,
        marginLeft: 15,
        marginTop: 3,
        color: '#333'
    }
})

