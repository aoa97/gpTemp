import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, StatusBar, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { secondColor } from '../../shared/constants'
import { _launchCameraRoll, _takePhoto } from './../../services/CameraAPI'
import * as firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyABjDdiaYm83rEkUsEG-u5aeegZrhNDSKs",
    authDomain: "family-social-communicat-b54bb.firebaseapp.com",
    databaseURL: "https://family-social-communicat-b54bb.firebaseio.com",
    projectId: "family-social-communicat-b54bb",
    storageBucket: "family-social-communicat-b54bb.appspot.com",
    messagingSenderId: "954697433619",
    appId: "1:954697433619:web:24ed30743d12f703e835e6"
};
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default class EditPost extends React.Component {
    state = {
        postTxt: this.props.navigation.getParam("postText"),
        postImages: this.props.navigation.getParam("postImages"),
        imgPicked: false,
        postExist: false,
    }
    edit = () => {
        firebase.database().ref(`posts/${this.props.navigation.getParam('postKey')}/text`).set(this.state.postTxt)
            .then(this.props.navigation.navigate('CommunityOverView', { communityKey: this.props.navigation.getParam("communityKey") }))
            .catch(error => {
                alert(error.toString())
                return
            })
    }
    render() {
        return (
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, marginTop: StatusBar.currentHeight }}>
                <View style={styles.postContainer}>
                    <TextInput style={styles.post}
                        placeholder="Type something ... "
                        placeholderTextColor='#888'
                        autoCapitalize="none"
                        value={this.state.postTxt}
                        multiline={true}
                        numberOfLines={3}
                        onChangeText={postTxt => this.setState({ postTxt })} />

                </View>
                {this.state.imgPicked &&
                    <View>
                        <Text>pick</Text>
                        <Image source={{ uri: this.state.postImg }} />
                    </View>
                }
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.icon} onPress={this.pickImage}>
                        <Icon name='picture-o' type='font-awesome' size={25} color={secondColor} />
                    </TouchableOpacity>
                    <View style={styles.iconSeparator}></View>
                    <TouchableOpacity style={styles.icon}>
                        <Icon name='camera' type='font-awesome' size={25} color={secondColor} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.submitBtn} onPress={this.edit}>
                    <Text style={styles.submitBtnTxt}>Edit</Text>
                </TouchableOpacity>
                <FlatList
                    style={{ marginTop: 20, }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={this.state.postImages}
                    //keyExtractor={(item) => item.key}
                    renderItem={({ item }) =>
                        <TouchableOpacity>
                            <Image source={{ uri: item }} style={{ marginHorizontal: 5, borderRadius: 5, width: 80, height: 80, borderWidth: 0.5, borderColor: secondColor }} />
                        </TouchableOpacity>
                    }
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({
    iconsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: secondColor
    },
    iconSeparator: {
        width: 1,
        backgroundColor: secondColor
    },
    icon: {
        margin: 15
    },
    submitBtn: {
        backgroundColor: secondColor,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
    },
    submitBtnTxt: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    postContainer: {
        borderWidth: 0.5,
        borderColor: '#555',
        borderRadius: 5,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 5,
        alignItems: 'center',
    },
    post: {
        fontSize: 17,
        flex: 1,
        paddingBottom: 20
    },
});