import React from 'react'
import { View, Text, StatusBar, Button, StyleSheet } from 'react-native'
import { secondColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'


export default class VerifyEmail extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.heading1}>Verify Email</Text>
                <Text style={styles.paragraph}>
                    An E-mail has been sent to your e-mail address{' '}
                    <Text style={{ fontWeight: 'bold' }}>{this.props.navigation.getParam('email')}</Text>
                    {'\n\n'}
                    Please click on that link to verify your email address.
            </Text>
                <View style={{ marginTop: 20 }}>
                    <Button title="Login" onPress={() => this.props.navigation.navigate('SignIn')} color={secondColor} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        padding: 25
    },
    heading1: {
        fontWeight: "bold",
        fontSize: 25,
        color: secondColor,
        textAlign: 'center',
        marginBottom: 10
    },
    paragraph: {
        fontSize: 18,
        color: '#555',
    },
})