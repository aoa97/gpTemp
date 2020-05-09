import React from 'react'
import { View, Button, Text, StatusBar, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Avatar } from 'react-native-elements'
import Header from '../../shared/Header'
import RightFloatingIcon from '../../shared/FloatingIcons/Right'
import LeftFloatingIcon from '../../shared/FloatingIcons/Left'
import { secondColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);


export default class CommunitiesList extends React.Component {
    constructor(props) {
        super(props)
        this.navigate = this.props.navigation.navigate
        this.currentUserID = firebase.auth().currentUser.uid
        this.state = {
            search: '',
            commKeys: [],
            communities: []
        }
    }

    // Life cycle executed before rendering on both client & server side (Will be deprecated soon => Find alternative)
    componentWillMount() {
        firebase.database().ref(`authenticatedUsers/${this.currentUserID}/communities`).on('value', snap => {
            var commKeys = []
            snap.forEach(child => {
                commKeys.push(child.key)
            })
            this.setState({ commKeys })
        })
    }

    componentDidMount () {
        firebase.database().ref(`communities`).on('value', snap => {
            var communities = []
            var keys = this.state.commKeys
            snap.forEach(child => {
                if (keys.includes(child.key))
                    communities.push({
                        name: child.val().name,
                        description: child.val().description,
                        image: child.val().avatar,
                        cover: child.val().cover,
                        key: child.key
                    })
            })
            this.setState({ communities })
        })
    }

    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
                <Header
                    title="Communities"
                    icon='newspaper-o' type='font-awesome' onPress={() => this.navigate('NewsFeed')}
                    icon2='plus' type2='font-awesome' onPress2={() => this.navigate('CreateCommunity')}
                    center
                />
                <RightFloatingIcon
                    icon='md-person' type='ionicon'
                    onPress={() => this.navigate('MyProfile', { communities: this.state.communities })}
                />
                <LeftFloatingIcon
                    icon='add-to-list' type='entypo'
                    onPress={() => Alert.alert('Coming soon :)')}
                />
                <FlatList
                    style={{ padding: 6 }}
                    data={this.state.communities}
                    keyExtractor={(item) => item.key}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => {
                            //this.props.navigation.navigate('CommunityRooms', { communityKey: item.key })
                            this.props.navigation.navigate('CommunityOverview', { communityKey: item.key })
                        }}>
                            <View style={styles.item}>
                                <Avatar rounded size={62} source={{ uri: item.image }} />
                                <View>
                                    <Text style={styles.communityName}>{item.name}</Text>
                                    <Text style={styles.communityDesc}>{item.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        borderColor: secondColor,
        borderWidth: 1,
        borderRadius: 2,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    communityName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15
    },
    communityDesc: {
        fontSize: 17,
        marginLeft: 15,
        marginTop: 3,
        color: '#333'
    }
})