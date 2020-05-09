import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar, ImageBackground, ScrollView, Alert } from 'react-native';
import { Avatar, Divider, Icon } from 'react-native-elements';
import PopMenu from '../../shared/PopMenu'
import RightFloatingIcon from '../../shared/FloatingIcons/Right'
import LeftFloatingIcon from '../../shared/FloatingIcons/Left'
import Post from '../../shared/Post'
import firebase from '../../services/firebaseConfig'

export default class CommunityOverview extends React.Component {
    constructor(props) {
        super(props);
        this.navigate = this.props.navigation.navigate
        this.communityKey = this.props.navigation.getParam("communityKey")
        this.state = {
            communityDetails: {},
            posts: []
        }
    }
    componentDidMount() {
        firebase.database().ref('communities').child(this.communityKey).on('value', snap => {
            this.setState({ communityDetails: snap.val() })
        })
        firebase.database().ref('posts').orderByChild(`communities/${this.communityKey}/key`).equalTo(`${this.communityKey}`)
            .on('value', snap => {
                var posts = []
                snap.forEach(post => {
                    var images = post.val().images || null, postImages = []
                    for (const child in images) {
                        postImages.push(images[child]['img'])
                    }
                    firebase.database().ref('authenticatedUsers').child(post.val().user).on('value', user => {
                        if (postImages.length > 0) {
                            posts.push({
                                postKey: post.key,
                                text: post.val().text,
                                images: postImages,
                                likesNumber: post.val().likesNumber,
                                commentsNumber: post.val().commentsNumber,
                                userName: user.val().fullName,
                                userAvatar: user.val().avatar,
                            })
                        }
                        else {
                            posts.push({
                                postKey: post.key,
                                text: post.val().text,
                                likesNumber: post.val().likesNumber,
                                commentsNumber: post.val().commentsNumber,
                                userName: user.val().fullName,
                                userAvatar: user.val().avatar,
                            })
                        }
                        this.setState({ posts })
                    })
                })
            })
    }
    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight, flex: 1 }}>
                <RightFloatingIcon
                    icon='md-list' type='ionicon'
                    onPress={() => this.navigate('CommunityRooms', { communityKey: this.communityKey })}
                />
                <LeftFloatingIcon
                    icon='plus' type='entypo'
                    onPress={() => this.navigate('CreatePost', { communityKey: this.communityKey, headingFrom: 'communityOverview' })}
                />
                <ScrollView>
                    <View style={{ marginBottom: 10 }}>
                        <ImageBackground
                            source={{ uri: this.state.communityDetails.cover }}
                            style={styles.cover}>
                            <View style={styles.coverIcon}>
                                <PopMenu
                                    item1='Members' onPress1={() => this.navigate('CommunityMembers', { communityKey: this.communityKey })}
                                    item2='Leave' onPress2={() => Alert.alert("Leave Community")}
                                />
                            </View>
                        </ImageBackground>
                        <View style={styles.profilePic}>
                            <Avatar
                                rounded
                                size={130}
                                source={{ uri: this.state.communityDetails.avatar }}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 10, marginTop: 5, marginBottom: 20 }}>
                            <Text style={styles.name}>{this.state.communityDetails.name}</Text>
                            <Text style={styles.description}>{this.state.communityDetails.description}</Text>
                        </View>
                    </View>
                    {/* <Divider style={{ backgroundColor: '#AAA', marginBottom: 20 }} /> */}
                    {this.state.posts.map(item => {
                        return (
                            <Post
                                postImages={item.images}
                                userName={item.userName}//{item.user}
                                userAvatar={item.userAvatar}
                                postText={item.text}
                                likesNumber={item.likesNumber}
                                CommentsNumber={item.commentsNumber}
                                postKey={item.postKey}
                                navigation={this.props.navigation}
                                communityKey={this.communityKey} /*'-M07uNj9HbQxc_ich644'{this.props.navigation.getParam("communityKey")}*/
                            />
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    cover: {
        backgroundColor: '#DDD',
        width: '100%', height: 166,
    },
    coverIcon: {
        position: 'absolute', right: 10,
        marginTop: 15, marginRight: 5
    },
    profilePic: {
        alignItems: 'center',
        marginTop: -60,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 2
    },
    description: {
        color: '#555',
        fontSize: 21,
        textAlign: 'center',
        letterSpacing: 1,
    }
})


/*
firebase.database().ref('posts')
//.orderByChild(`communities/${this.communityKey}/key`).equalTo(`${this.communityKey}`)
.on('value', (dataSnapshot) =>{
    let promises = [];
    dataSnapshot.forEach((child) => {
        var userId = child.val().user
        let userRef = firebase.database().ref('authenticatedUsers').child(userId);
        promises.push( userRef.child('fullName').once('value'));
    })
    Promise.all(promises).then((snapshots) => {
        return snapshots.map((userNameSnapshot) => userNameSnapshot.val());
    })
    .then((userNames) => {
        let postsList = [];
        let index = 0;
        dataSnapshot.forEach((child) => {
            postsList.push({
                image: child.val().image,
                text: child.val().text,
                user: userNames[index],
                likesNumber: child.val().likesNumber,
                commentsNumber: child.val().commentsNumber,
                postKey: child.key,
                userKey: child.val().user
            })
            index = index + 1;
        });
        this.setState({ posts: postsList.reverse() })
    })
})
firebase.database().ref('posts').orderByChild(`communities/${this.communityKey}/key`)
.equalTo(`${this.communityKey}`).once('value', snap => {
    var posts = []
    snap.forEach(post => {
        firebase.database().ref('authenticatedUsers').child(post.val().user).once('value', user => {
            posts.push({
                postKey: post.key,
                text: post.val().text,
                likesNumber: post.val().likesNumber,
                commentsNumber: post.val().commentsNumber,
                userName: user.val().fullName,
                userAvatar: user.val().avatar
            })
            this.setState({ posts })
        })
    })
})
firebase.database().ref('posts').child(this.communityKey).on('value', snap => {
    var posts = []
    snap.forEach(child => {
        posts.push({
            key: child.key,
            timestamp: child.val().timestamp,
            text: child.val().text,
            image: child.val().image,
            likesNumber: child.val().likesNumber,
            commentsNumber: child.val().commentsNumber,
            user: child.val().user
        })
    })
    this.setState({ posts })
})*/