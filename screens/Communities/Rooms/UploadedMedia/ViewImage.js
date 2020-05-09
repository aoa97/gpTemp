import React from 'react'
import { View, StyleSheet, StatusBar, FlatList, TouchableHighlight, Image, Text } from 'react-native'

export default class ViewImage extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'stretch' }}>
                <StatusBar hidden={true} />
                <Image source={{ uri: this.props.navigation.getParam("uri") }} style={{ flex: 1 }} />
            </View>
        )
    }
}