import React from 'react'
import { View, Button, Text, StatusBar, FlatList, StyleSheet } from 'react-native'
import { SearchBar, Avatar } from 'react-native-elements';
import firebase from '../../services/firebaseConfig'
import Header from '../../shared/Header'

export default class CommunityMembers extends React.Component {
    constructor(props) {
        super(props)
        this.communityKey = this.props.navigation.getParam('communityKey')
        this.db = firebase.database()
        this.state = {
            search: '',
            communityMembers: []
        }
    }

    componentDidMount() {
        this.db.ref(`communities/${this.communityKey}/members`).on('value', snap => {
            var communityMembers = []
            snap.forEach(child => {
                this.db.ref(`authenticatedUsers/${child.key}`).on('value', snap => {
                    communityMembers.push({
                        key: snap.key,
                        name: snap.val().fullName,
                        avatar: snap.val().avatar,
                    })
                })
            })
            this.setState({ communityMembers })
        })
    }

    render() {
        const renderUser = (item) => (
            <View style={styles.item}>
                <Avatar rounded size="medium" source={{ uri: item.avatar }} />
                <View>
                    <Text style={styles.memberName}>{item.name}</Text>
                </View>
            </View>
        )
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header
                    title='Members'
                    icon='user-plus' type='font-awesome'
                    onPress={() => this.props.navigation.navigate('ChooseMembers', { 
                        backScreen: "CommunityMembers",
                        //existedMembers: this.state.communityMembers
                    })}
                />
                <SearchBar
                    lightTheme
                    containerStyle={{ backgroundColor: '#FFF' }}
                    inputContainerStyle={{ backgroundColor: '#DDD' }}
                    placeholder="Search a Member"
                    value={this.state.search}
                    onChangeText={search => this.setState({ search })} />
                <FlatList
                    style={{ padding: 6 }}
                    data={this.state.communityMembers}
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
        fontWeight: 'bold',
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
