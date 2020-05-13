import React from 'react'
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { secondColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'

export default class MyProfile extends React.Component {
    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.navigate = this.props.navigation.navigate
        this.communities = this.props.navigation.getParam('communities')
        this.state = {
            avatar: '',
            profName: '',
            profBio: 'Hello from the other side',
            friends: []
        }
    }

    componentDidMount() {
        firebase.database().ref(`authenticatedUsers/${this.currentUser.uid}`).on('value', child => {
            this.setState({
                avatar: child.val().avatar,
                profName: child.val().fullName,
                profBio: child.val().bio
            })
        })
        firebase.database().ref('authenticatedUsers').on('value', snap => {
            var friends = []
            snap.forEach(child => {
                if (child.key != firebase.auth().currentUser.uid) {
                    friends.push({
                        key: child.key,
                        name: child.val().fullName,
                        avatar: child.val().avatar
                    })
                }
            })
            this.setState({ friends })
        })
    }

    logout = async () => {
        try {
            await firebase.auth().signOut();
            this.props.navigation.navigate('SignIn')
        } catch (e) {
            console.log(e);
        }
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
                {/* Buttons */}
                <TouchableOpacity style={styles.editProfile} onPress={() => this.props.navigation.navigate('EditProfile')}>
                    <Icon name='settings' type='ionicons' color={secondColor} size={35} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.logout} onPress={this.logout}>
                    <Icon name='log-out' type='entypo' color={secondColor} size={35} />
                </TouchableOpacity>

                {/* Details */}
                <View style={{ marginTop: 40 }}>
                    <View style={styles.profDetails}>
                        <Avatar rounded size='xlarge' source={{ uri: this.state.avatar }} />
                        <Text style={styles.profName}>{this.state.profName}</Text>
                        <Text style={styles.profBio}>{this.state.profBio}</Text>
                    </View>
                    <TouchableOpacity style={styles.listBox} onPress={() => this.navigate('FriendsList', { friends: this.state.friends })}>
                        <Text style={styles.boxHeader}>My Friends :-</Text>
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
                    <TouchableOpacity style={styles.listBox} onPress={() => this.props.navigation.goBack(null)}>
                        <Text style={styles.boxHeader}>My Communities :-</Text>
                        <View style={styles.boxAvatar}>
                            {this.communities.map(item => {
                                return (
                                    <Avatar
                                        rounded size={48} source={{ uri: item.image }}
                                        containerStyle={{ borderWidth: 1, borderColor: '#FFF', marginRight: 5 }}
                                    />
                                )
                            })}
                            {more(this.communities)}
                        </View>
                    </TouchableOpacity>
                </View>
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
    },
    editProfile: {
        position: 'absolute',
        left: 20, top: 20
    },
    logout: {
        position: 'absolute',
        right: 20, top: 20
    }
})