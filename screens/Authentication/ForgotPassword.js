import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableHighlight, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { secondColor, firstColor } from '../../shared/constants'
import firebase from '../../services/firebaseConfig'

export default class ForgotPassword extends React.Component {
    state = {
        email: '',
        err: '',
    }
    searchEmail = async () => {
        try {
            await firebase.auth().sendPasswordResetEmail(this.state.email.trim())
            Alert.alert("Reset link has been sent, Please check your email")
        } catch (error) {
            this.setState({ err: error })
            alert(this.state.err)
        }
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.screenContainer} behavior="padding" enabled>
                <View style={styles.forgetContainer}>
                    <Text style={styles.header}>Forgot Password ?</Text>
                    <Text style={styles.paragraph}>We need your registered email address to send your password reset</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="E-mail Adress"
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        autoCapitalize='none'
                        autoCompleteType="off"
                    />
                    <Button title="RESET PASSWORD" onPress={this.searchEmail} buttonStyle={styles.button} />
                </View>
                <View style={styles.acountExistQuestionContainer}>
                    <Text style={styles.paragraph}>Don't have an account ?</Text>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('SignUp')}>
                        <Text style={styles.regester}>Sign Up</Text>
                    </TouchableHighlight>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 20,
    },
    forgetContainer: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acountExistQuestionContainer: {
        flex: 0.3,
        alignItems: 'center',
        //justifyContent:'center',
    },
    enterEmailContainer: {
        flex: 0.4
    },
    header: {
        fontWeight: "bold",
        fontSize: 22,
        color: secondColor
    },
    paragraph: {
        fontSize: 18,
        color: '#888888',
        textAlign: 'center',
        marginTop: 8,
    },
    textInput: {
        width: 285, height: 39,
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: '#9b9b9b',
        marginBottom: 12
    },
    regester: {
        fontSize: 20,
        fontWeight: "bold",
        color: secondColor
    },
    error: {
        color: 'red',
        fontSize: 13
    },
    button: {
        marginTop: 12,
        marginBottom: 30,
        color: secondColor,
        width: 285, height: 39,
        backgroundColor: secondColor
    },
}) 