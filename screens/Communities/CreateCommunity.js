import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, FlatList, StatusBar } from 'react-native';
import { SearchBar, Avatar, Icon, Divider, Button } from 'react-native-elements';
import { _launchCameraRoll, _takePhoto } from '../../services/CameraAPI'
import { secondColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'
import { ScrollView } from 'react-native-gesture-handler';

export default class CreateCommunity extends React.Component {
    constructor(props) {
        super(props)
        this.navigate = this.props.navigation.navigate
        this.selMembers = this.props.navigation.getParam('selMembers') ? this.props.navigation.getParam('selMembers') : []
        this.currentUser = firebase.auth().currentUser
        this.currentUserDetails = {
            avatar: this.currentUser.photoURL,
            key: this.currentUser.uid,
            name: this.currentUser.displayName
        }
        this.db = firebase.database()
        this.state = {
            commName: '',
            commDesc: '',
            commAvatar: 'http://placehold.it/130',
            commCover: 'http://placehold.it/360x166',
            adminID: ''
        }
    }

    componentDidMount() {
        // Get the creator key to assign admin authority to him
        const adminID = firebase.auth().currentUser.uid
        this.setState({ adminID })
    }

    pickAvatar = () => {
        let promObject = _launchCameraRoll()
        promObject.then(res => {
            res.url.then(res => {
                this.setState({ commAvatar: res })
            })
        })
    }

    pickCover = () => {
        let promObject = _launchCameraRoll()
        promObject.then(res => {
            res.url.then(res => {
                this.setState({ commCover: res })
            })
        })
    }

    handleCreation = () => {
        this.db.ref('communities').push({
            name: this.state.commName,
            description: this.state.commDesc,
            avatar: this.state.commAvatar,
            cover: this.state.commCover,
        }).then(res => {
            const members = [this.currentUserDetails, ...this.selMembers]
            members.forEach(item => {
                this.db.ref(`communities/${res.key}/members/${item.key}`).set({
                    admin: item.key === this.state.adminID ? true : false
                })
                this.db.ref(`authenticatedUsers/${item.key}/communities/${res.key}`).set({
                    admin: item.key === this.state.adminID ? true : false
                })
            })
            this.navigate('CommunityOverview', { communityKey: res.key })
        })
    }
    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <View>
                    <TouchableOpacity onPress={this.pickCover}>
                        <ImageBackground
                            source={{ uri: this.state.commCover }}
                            style={styles.cover}>
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={styles.profilePic}>
                        <TouchableOpacity onPress={this.pickAvatar}>
                            <Avatar
                                editButton
                                rounded
                                size={130}
                                source={{ uri: this.state.commAvatar }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                        <TextInput
                            style={styles.communityNameTxtInput}
                            placeholder="Enter Community Name"
                            placeholderTextColor='#444'
                            autoCapitalize="none"
                            value={this.state.commName}
                            onChangeText={commName => this.setState({ commName })}
                        />
                        <TextInput
                            style={styles.communityDisTxtInput}
                            placeholder="Enter Community Description"
                            placeholderTextColor='#444'
                            autoCapitalize="none"
                            value={this.state.commDesc}
                            onChangeText={commDesc => this.setState({ commDesc })}
                        />
                    </View>
                </View>
                <Divider style={{ backgroundColor: '#AAA', marginTop: 5 }} />
                <TouchableOpacity style={styles.addMembers} onPress={() => this.navigate('ChooseMembers', { backScreen: "CreateCommunity" })}>
                    <Icon type='font-awesome' name='plus' size={25} color={'#555'} />
                    <Text style={styles.addMembersTxt}>Add Members</Text>
                </TouchableOpacity>

                <FlatList
                    style={{ paddingHorizontal: 8, height: 150 }}
                    data={this.renderMembers ? this.renderMembers : [this.currentUserDetails]}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <View style={styles.list}>
                            <Avatar rounded source={{ uri: item.avatar }} size={48} />
                            <Text style={{ fontSize: 18, marginLeft: 10 }}>{item.name}</Text>
                        </View>
                    )}
                />

                <View style={{ alignItems: 'center', marginTop: 25 }}>
                    <Button
                        buttonStyle={{ color: secondColor, width: 285, height: 39, backgroundColor: secondColor }}
                        title="CREATE"
                        onPress={this.handleCreation}
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    cover: {
        backgroundColor: '#DDD',
        width: '100%', height: 166,
    },
    coverIcon: {
        position: 'absolute', right: 20,
        marginTop: 15, marginRight: 5
    },
    profilePic: {
        alignItems: 'center',
        marginTop: -70,
    },
    communityNameTxtInput: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    communityDisTxtInput: {
        fontSize: 19,
        textAlign: 'center',
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
})
