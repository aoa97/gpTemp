import React from 'react'
import { View, Text, StatusBar, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { SearchBar, Avatar } from 'react-native-elements'
import Header from '../../shared/Header'
import firebase from '../../services/firebaseConfig'

export default class OtherCommunities extends React.Component {
    constructor(props) {
        super(props)
        this.communities = this.props.navigation.getParam('communities')
        this.state = {
            search: ''
        }
    }
    render() {
        const renderFriend = (item) => (
            <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('OtherProfile', {
                key: item.key,
                name: item.name,
                avatar: item.avatar
            })}>
                <Avatar rounded size="medium" source={{ uri: item.avatar }} />
                <View>
                    <Text style={styles.memberName}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header title='communities' />
                <SearchBar
                    lightTheme
                    containerStyle={{ backgroundColor: '#FFF' }}
                    inputContainerStyle={{ backgroundColor: '#DDD' }}
                    placeholder="Search a Member"
                    value={this.state.search}
                    onChangeText={search => this.setState({ search })} />
                <FlatList
                    style={{ padding: 6 }}
                    data={this.communities}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) => renderFriend(item)}
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
