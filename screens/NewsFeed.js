import React from 'react'
import { View, Text, StatusBar, ScrollView } from 'react-native'
import Header from '../shared/Header'
import Middle from '../shared/FloatingIcons/Middle'
import Post from '../shared/Post'
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

export default class NewsFeed extends React.Component {
    constructor(props) {
        super(props)
        this.navigate = this.props.navigation.navigate
        this.state = {
            posts: [],
        }
    }

    componentDidMount() {
        this.listenForPosts()
    }

    // Queries need to be reconsidered (for enhancing render time)
    listenForPosts = () => {
        firebase.database().ref('posts').on('value', snap => {
            var posts = []
            snap.forEach(post => {
                var communities = post.val().communities, images = post.val().images || null
                var commNames = [], postImages = []
                for (const child in communities) {
                    commNames.push({
                        name: communities[child]['name'],
                        key: communities[child]['key']
                    })
                }
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
                            communities: commNames,
                            userName: user.val().fullName,
                            userAvatar: user.val().avatar,
                            postMakerKey: user.key
                        })
                    }
                    else {
                        posts.push({
                            postKey: post.key,
                            text: post.val().text,
                            likesNumber: post.val().likesNumber,
                            commentsNumber: post.val().commentsNumber,
                            communities: commNames,
                            userName: user.val().fullName,
                            userAvatar: user.val().avatar,
                            postMakerKey: user.key
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
                <Header
                    center
                    title='Newsfeed'
                    icon='wechat' type='font-awesome' onPress={() => alert("Left Icon")}
                    icon2='th-list' type2='font-awesome' onPress2={() => this.navigate('CommunitiesStack')}
                />
                <ScrollView style={{ padding: 5 }}>
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
                                communities={item.communities}
                                postMakerKey={item.postMakerKey}
                            //communityKey = {this.communityKey} /*'-M07uNj9HbQxc_ich644'{this.props.navigation.getParam("communityKey")}*/
                            />
                        )
                    })}
                </ScrollView>
                <Middle
                    icon='plus' type='font-awesome'
                    onPress={() => this.navigate('CreatePost', { headingFrom: 'newsFeed' })}
                />
            </View>
        )
    }
}