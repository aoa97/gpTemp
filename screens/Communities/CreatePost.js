import React from 'react';
import { ScrollView, FlatList, View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, TextInput } from 'react-native';
import { Avatar, Divider, Icon } from 'react-native-elements';
import Header from '../../shared/Header'
import { secondColor } from '../../shared/constants'
import { _launchCameraRoll, _takePhoto } from '../../services/CameraAPI'
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

export default class CreateNewPostScreen extends React.Component {
    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser
        this.state = {
            postTxt: '',
            postImg: [],
            imgPicked: false,
            postExist: false,
            communities: [],
            communitiesPicked: [],
        }
    }


    // Life cycle executed before rendering on both client & server side (Will be deprecated soon => Find alternative)
    componentWillMount() {
        firebase.database().ref(`authenticatedUsers/${this.currentUser.uid}/communities`).on('value', snap => {
            var commKeys = []
            snap.forEach(child => {
                commKeys.push(child.key)
            })
            this.setState({ commKeys })
        })
    }
    componentDidMount() {
        firebase.database().ref(`communities`).on('value', snap => {
            var communities = []
            var keys = this.state.commKeys
            snap.forEach(child => {
                if (keys.includes(child.key))
                    communities.push({
                        name: child.val().name,
                        image: child.val().avatar,
                        key: child.key
                    })
            })
            this.setState({ communities })
        })
    }



    chooseComunity(community) {
        const FilteredComunitiesList = this.state.communities.filter(item => item.key !== community.key);
        this.setState({ communities: FilteredComunitiesList });
        this.setState({
            communitiesPicked: [...this.state.communitiesPicked,
            {
                name: community.name,
                image: community.image,
                key: community.key
            }

            ]
        })
    }
    deleteChosenCommunity(community) {
        const FilteredComunitiesList = this.state.communitiesPicked.filter(item => item.key !== community.key);
        this.setState({ communitiesPicked: FilteredComunitiesList });
        this.setState({
            communities: [...this.state.communitiesPicked,
            {
                name: community.name,
                image: community.image,
                key: community.key
            }

            ]
        })
    }
    submit = () => {
        if (this.state.postTxt === '' && this.state.postImg.length < 1 || this.state.communitiesPicked.length === 0) {
            this.props.navigation.navigate('CommunityOverview')
        } else {
            firebase.database().ref('posts').push({
                user: this.currentUser.uid,
                text: this.state.postTxt,
                //image: this.state.postImg,
                likesNumber: 0,
                commentsNumber: 0,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
            })
                .then((res) => { this.setState({ key: res.key }) })
                .then(() => {
                    this.state.communitiesPicked.forEach((choosenCommunity) => {
                        firebase.database()
                            .ref(`posts/${this.state.key}/communities/${choosenCommunity.key}`)
                            .set({ key: choosenCommunity.key, name: choosenCommunity.name })
                    })
                })
                .then(() => {
                    this.state.postImg.forEach((postImgs) => {
                        firebase.database()
                            .ref(`posts/${this.state.key}/images`).push({ img: postImgs })
                    })
                })
                .then(() => {
                    this.props.navigation.navigate('CommunityOverview')
                })
                .catch(error => { alert(error.toString()) })
        }
    }
    pickImage = () => {
        let promObject = _launchCameraRoll()
        promObject.then(res => {
            res.url.then(res => {
                this.setState({ postImg: [...this.state.postImg, res] })
            })
        })
    }
    takePhoto = () => {
        let promObject = _takePhoto()
        promObject.then(res => {
            res.url.then(res => {
                this.setState({ postImg: [...this.state.postImg, res] })
            })
        })
    }



    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header title="New Post .." />

                <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
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
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={styles.icon} onPress={this.pickImage}>
                            <Icon name='picture-o' type='font-awesome' size={25} color={secondColor} />
                        </TouchableOpacity>
                        <View style={styles.iconSeparator}></View>
                        <TouchableOpacity style={styles.icon} onPress={this.takePhoto}>
                            <Icon name='camera' type='font-awesome' size={25} color={secondColor} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.submitBtn} onPress={this.submit}>
                        <Text style={styles.submitBtnTxt}>SUBMIT</Text>
                    </TouchableOpacity>
                    {this.state.postImg.length > 0 &&
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {this.state.postImg.length < 5 &&
                                <TouchableOpacity style={{}}>
                                    <Text>ADD</Text>
                                    <Icon name='plus' type='font-awesome' size={30} style={{}} />
                                </TouchableOpacity>
                            }
                            <FlatList
                                style={{ marginTop: 20, }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.postImg}
                                //keyExtractor={(item) => item.key}
                                renderItem={({ item }) =>
                                    <TouchableOpacity>
                                        <Image source={{ uri: item }} style={{ marginHorizontal: 5, borderRadius: 5, width: 80, height: 80, borderWidth: 0.5, borderColor: secondColor }} />
                                    </TouchableOpacity>
                                }
                            />
                        </View>
                    }

                    <FlatList
                        style={{ borderColor: secondColor, borderWidth: 2, marginTop: 20, }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={this.state.communitiesPicked}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => { this.deleteChosenCommunity(item) }}>
                                <View style={styles.item}>
                                    <Avatar rounded size={40} source={{ uri: item.image }} />
                                    <View>
                                        <Text style={styles.communityName}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                    <FlatList
                        style={{ borderColor: secondColor, borderWidth: 2, borderRadius: 3, marginTop: 20, }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={this.state.communities}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => { this.chooseComunity(item) }}>
                                <View style={styles.item}>
                                    <Avatar rounded size={40} source={{ uri: item.image }} />
                                    <View>
                                        <Text style={styles.communityName}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }
                    />
                    <ScrollView>

                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15,
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
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 5,
    },
    submitBtnTxt: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    postContainer: {
        borderWidth: 1,
        borderColor: secondColor,
        borderRadius: 5,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    post: {
        fontSize: 17,
        flex: 1,
    },
    item: {
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center',
    },
    communityName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15
    },
    communityDesc: {
        fontSize: 17,
        marginLeft: 15,
        marginTop: 3,
        color: '#333'
    }
});