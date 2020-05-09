import React from 'react'
import { View, Text, StatusBar } from 'react-native'

export default class FriendsRequests extends React.Component {
    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Text>Requests</Text>
            </View>
        )
    }
}