import React from 'react'
import { View, Text, StatusBar, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import Header from '../../shared/Header'
import firebase from '../../services/firebaseConfig'

export default class ChooseMembers extends React.Component {
    constructor(props) {
        super(props)
        this.navigatate = this.props.navigation.navigate
        this.currentUser = firebase.auth().currentUser
        this.state = {
            authUsers: [],
            selMembers: [],
            selected: false,
        }
    }

    componentDidMount() {
        firebase.database().ref(`authenticatedUsers`).on('value', snap => {
            var authUsers = []
            snap.forEach(child => {
                if (child.key !== this.currentUser.uid) {
                    authUsers.push({
                        name: child.val().fullName,
                        avatar: child.val().avatar,
                        key: child.key
                    })
                }
            })
            this.setState({ authUsers })
        })
    }

    selectItem = (user) => {
        this.setState({
            selMembers: [...this.state.selMembers]
        })
    }

    backScreen = this.props.navigation.getParam('backScreen')
    goBack = () => {
        var members = this.state.selMembers
/*         members.push({
            avatar: this.currentUser.photoURL,
            key: this.currentUser.uid,
            name: this.currentUser.displayName
        })
 */        if (this.backScreen === "CreateCommunity")
            this.navigatate('CreateCommunity', { selMembers: this.state.selMembers })
        else if (this.backScreen === "CommunityMembers")
            this.navigatate('CommunityMembers', { selMembers: this.state.selMembers })
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
                    data={this.state.authUsers}
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

