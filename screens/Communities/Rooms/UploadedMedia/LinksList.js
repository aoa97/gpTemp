import React from 'react'
import { View, Linking, TouchableOpacity, FlatList, Text, StatusBar, StyleSheet } from 'react-native'
import firebase from '../../../../services/firebaseConfig'
import Header from '../../../../shared/Header'

export default class LinksList extends React.Component {
    constructor(props) {
        super(props)
        this.communityKey = this.props.navigation.getParam('communityKey')
        this.roomKey = this.props.navigation.getParam('roomKey')
        this.state = {
            links: []
        }
    }

    componentDidMount() {
        firebase.database().ref(`rooms/${this.communityKey}/${this.roomKey}/chatLinks`).on('value', snap => {
            var links = []
            snap.forEach(child => {
                links.push({
                    link: child.val().link,
                    key: child.key
                })
            })
            this.setState({ links })
        })
    }

    render() {
        const renderItem = (item) => (
            <TouchableOpacity style={styles.linkParent} >
                <Text style={styles.link} onPress={() => Linking.openURL('http://' + item.link)}>{item.link}</Text>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header title='Links' />
                <View style={styles.container}>
                    <FlatList
                        data={this.state.links}
                        keyExtractor={item => item.key.toString()}
                        renderItem={({ item }) => renderItem(item)}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    linkParent: {
        backgroundColor: '#DDD',
        padding: 10,
        marginBottom: 8
    },
    link: {
        fontSize: 20,
    }
})