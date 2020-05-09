import React from 'react'
import { View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native'
import { Text } from 'react-native-elements';
import { secondColor } from '../shared/constants'

export default class Welcome extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate("CommunitiesStack")
        }, 2000)
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text} h1>Welcome</Text>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'center', flex: 1,
        backgroundColor: secondColor
    },
    text: {
        color: '#FFF',
    }
})