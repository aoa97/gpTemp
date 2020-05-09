import React from 'react'
import { View, Text, StatusBar } from 'react-native'

export default class ForgotPassword extends React.Component {
    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Text>Forgot Password</Text>
            </View>
        )
    }
}