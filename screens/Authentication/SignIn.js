import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native'
import { Icon, Text, Button, Avatar } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { secondColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'


export default class SignIn extends React.Component {
    state = {
        email: 'eng.ahmedusamma@gmail.com',
        password: '010011012',
    }
    handleSignIn = (email, password) => {
        // Form Validation
        if (email.length == 0 || password.length == 0) {
            Alert.alert("Please complete the entire fields")
            return
        }
        // Sign In
        firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
            .then(res => {
                if (!res.user.emailVerified)
                    Alert.alert("Your email is not verified, Please verify your email")
                this.props.navigation.navigate('NewsFeed')
            })
            .catch(error => Alert.alert(error.toString()))
    }
    render() {
        return (
            <View style={{ paddingTop: 100, alignItems: 'center' }} >
                <Text h3 style={styles.heading}>Welcome Back</Text>
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                />
                <TextInput
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password })}
                />
                <Button
                    buttonStyle={styles.button}
                    title="SIGN IN"
                    onPress={() => this.handleSignIn(this.state.email, this.state.password)} />
                <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgotPassword")}>
                    <Text style={styles.signUp}>Forgot your password?</Text>
                </TouchableOpacity>
                <Text style={styles.dont}>Already have an account ?</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")}>
                    <Text style={styles.signUp}>Sign Up</Text>
                </TouchableOpacity>
                <KeyboardSpacer />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        width: 285, height: 39,
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: '#9b9b9b',
        marginBottom: 12
    },
    heading: {
        color: secondColor,
        marginBottom: 20
    },
    button: {
        marginTop: 12,
        marginBottom: 15,
        width: 285, height: 39,
        backgroundColor: secondColor
    },
    dont: {
        fontSize: 17
    },
    signUp: {
        fontSize: 17,
        fontWeight: 'bold',
        color: secondColor,
    },
})