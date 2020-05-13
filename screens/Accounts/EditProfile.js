import React from 'react'
import { View, StatusBar, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Icon, Text, Button, Avatar } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { secondColor } from '../../shared/constants'
import { _launchCameraRoll, _takePhoto } from '../../services/CameraAPI'
import firebase from '../../services/firebaseConfig'

export default class EditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.db = firebase.database().ref(`authenticatedUsers/${this.currentUser.uid}`)
        this.state = {
            avatar: '',
            bio: '',
            fullName: this.currentUser.displayName,
            email: this.currentUser.email,
            password: '',
            rePassword: '',
        }
    }

    componentDidMount() {
        this.db.once('value', child => {
            this.setState({
                avatar: child.val().avatar,
                bio: child.val().bio,
                fullName: child.val().fullName
            })
        })
    }

    url = ''
    pickAvatar = () => {
        let promObject = _launchCameraRoll()
        promObject.then(res => {
            res.url.then(res => {
                this.setState({ avatar: res })
            })
        })
    }

    handleEditProfile = (avatar, bio, fullName, email, password, rePassword) => {
        this.db.update({ avatar, bio, fullName })
        this.currentUser.updateProfile({
            displayName: fullName.trim(),
            photoURL: avatar,
        })
        if (password !== rePassword) {
            Alert.alert("Password & repassword don't match, please match both fields and try again")
            return
        }
        if (password.length < 6 && password.length > 0) {
            Alert.alert("Please enter at least 6 characters for password")
            return;
        }
        if (password.length != 0) {
            this.currentUser.updatePassword(password)
                .then(Alert.alert("Your password changed succefully"))
        }
        if (email !== this.currentUser.email) {
            this.db.update({ email })
            this.currentUser.updateEmail(email.trim())
                .then(() => {
                    firebase.auth().signOut().then(() => {
                        this.currentUser.sendEmailVerification()
                        Alert.alert("Your E-mail changed succefully, please sign in again")
                        return this.props.navigation.navigate('SignIn')
                    })
                })
                .catch(e => Alert.alert(e.message))
        }
        this.props.navigation.navigate('MyProfile')
    }

    render() {
        var profileIcon = 'https://www.searchpng.com/wp-content/uploads/2019/02/Deafult-Profile-Pitcher.png'
        return (
            <View style={{ marginTop: StatusBar.currentHeight, padding: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text h3 style={styles.heading}>Edit Profile</Text>
                    <Avatar
                        rounded
                        showEditButton
                        onEditPress={this.pickAvatar}
                        size={'large'}
                        icon={{ name: 'user', type: 'font-awesome' }}
                        source={{ uri: this.state.avatar ? this.state.avatar : profileIcon }}
                        containerStyle={{ marginBottom: 15 }}
                    />
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Bio"
                        value={this.state.bio}
                        onChangeText={bio => this.setState({ bio })}
                    />
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Full Name"
                        value={this.state.fullName}
                        onChangeText={fullName => this.setState({ fullName })}
                    />
                    <TextInput
                        autoCapitalize='none'
                        style={styles.TextInput}
                        placeholder="E-Mail"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <TextInput
                        secureTextEntry
                        autoCapitalize='none'
                        placeholder="New Password"
                        style={styles.TextInput}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    <TextInput
                        secureTextEntry
                        autoCapitalize='none'
                        style={styles.TextInput}
                        placeholder="Re-Password"
                        value={this.state.rePassword}
                        onChangeText={rePassword => this.setState({ rePassword })}
                    />
                    <Button
                        buttonStyle={styles.button}
                        title="Confirm"
                        onPress={() => this.handleEditProfile(this.state.avatar, this.state.bio, this.state.fullName, this.state.email, this.state.password, this.state.rePassword)} />
                </View>
                <KeyboardSpacer />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading: {
        color: secondColor,
        marginBottom: 20
    },
    TextInput: {
        width: 285, height: 39,
        fontSize: 20,
        borderBottomWidth: 1,
        borderColor: '#9b9b9b',
        marginBottom: 12
    },
    button: {
        marginTop: 12,
        marginBottom: 15,
        color: secondColor,
        width: 285, height: 39,
        backgroundColor: secondColor
    },
    already: {
        fontSize: 17
    },
    SignIn: {
        fontSize: 17,
        fontWeight: 'bold',
        color: secondColor,
    },
})