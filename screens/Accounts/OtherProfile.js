import React from 'react'
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Avatar } from 'react-native-elements'
import { secondColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'

export default class MyProfile extends React.Component {
    constructor(props) {
        super(props)
        this.navigate = this.props.navigation.navigate
        this.key = this.props.navigation.getParam('key')
        this.name = this.props.navigation.getParam('name')
        this.avatar = this.props.navigation.getParam('avatar')
        this.state = {
            friends: [],
            communities: []
        }
    }
    // Life cycle executed before rendering on both client & server side (Will be deprecated soon => Find alternative)
    componentWillMount() {
        firebase.database().ref(`authenticatedUsers/${this.key}/communities`).on('value', snap => {
            var commKeys = []
            snap.forEach(child => {
                commKeys.push(child.key)
            })
            this.setState({ commKeys })
        })
    }
    componentDidMount() {
        // Get Communities
        firebase.database().ref('authenticatedUsers').on('value', snap => {
            var friends = []
            snap.forEach(child => {
                if (child.key != this.key) {
                    friends.push({
                        key: child.key,
                        name: child.val().fullName,
                        avatar: child.val().avatar
                    })
                }
            })
            this.setState({ friends })
        })

        // Get Friends
        firebase.database().ref(`communities`).on('value', snap => {
            var communities = []
            var keys = this.state.commKeys
            snap.forEach(child => {
                if (keys.includes(child.key))
                    communities.push({
                        name: child.val().name,
                        description: child.val().description,
                        avatar: child.val().avatar,
                        cover: child.val().cover,
                        key: child.key
                    })
            })
            this.setState({ communities })
        })
    }

    render() {
        const more = (list) => {
            if (list.length > 4) {
                return (
                    <View style={styles.boxMore}>
                        <Text style={{ fontWeight: 'bold', fontSize: 25, flex: 1 }}>...</Text>
                    </View>
                )
            }
        }
        return (
            <View style={{ marginTop: StatusBar.currentHeight, alignItems: 'center' }}>
                <View style={styles.profDetails}>
                    <Avatar rounded size='xlarge' source={{ uri: this.avatar }} />
                    <Text style={styles.profName}>{this.name}</Text>
                    <Text style={styles.profBio}>Account bio will be plugined here</Text>
                </View>
                <TouchableOpacity style={styles.listBox} onPress={() => this.navigate('FriendsList', { friends: this.state.friends })}>
                    <Text style={styles.boxHeader}>Friends :-</Text>
                    <View style={styles.boxAvatar}>
                        {this.state.friends.map(item => {
                            return (
                                <Avatar
                                    rounded size={48} source={{ uri: item.avatar }}
                                    containerStyle={{ borderWidth: 1, borderColor: '#FFF', marginRight: 5 }}
                                />
                            )
                        })}
                        {more(this.state.friends)}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listBox} onPress={() => this.navigate('OtherCommunities', { communities: this.state.communities })}>
                    <Text style={styles.boxHeader}>Communities :-</Text>
                    <View style={styles.boxAvatar}>
                        {this.state.communities.map(item => {
                            return (
                                <Avatar
                                    rounded size={48} source={{ uri: item.avatar }}
                                    containerStyle={{ borderWidth: 1, borderColor: '#FFF', marginRight: 5 }}
                                />
                            )
                        })}
                        {more(this.state.communities)}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    profDetails: {
        marginTop: 20,
        marginBottom: 40,
        padding: 10,
        alignItems: 'center'
    },
    profName: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 25
    },
    profBio: {
        fontSize: 20,
        color: '#555'
    },
    listBox: {
        backgroundColor: secondColor,
        width: 330,
        padding: 15,
        marginBottom: 20,
        borderRadius: 15
    },
    boxHeader: {
        color: '#FFF',
        fontSize: 20,
        marginBottom: 10
    },
    boxAvatar: {
        flexDirection: 'row',
    },
    boxMore: {
        width: 45, height: 45,
        backgroundColor: '#FFF',
        borderRadius: 48,
        alignItems: 'center', justifyContent: 'center',
    }
})