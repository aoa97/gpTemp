import React from 'react'
import { View, Text, StatusBar, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Modal, Alert, Dimensions } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { SliderBox } from "react-native-image-slider-box";
import Pop from './PopMenu'
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

export default class Post extends React.Component {
    constructor(props) {
        super(props)
        this.currentUser = firebase.auth().currentUser.uid
        this.db = firebase.database()
        this.navigate = this.props.navigation.navigate
        this.communities = this.props.communities || []
        this.state = {
            commentsModalVisible: false,
            likersModalVisible: false,
            editCommentModalVisible: false,
            liked: true,
            comments: [],
            likers: [],
            commentTxt: '',
            editComment: '',
            editCommentKey: '',
        }
    }
    componentDidMount() {
        this.db.ref('posts').child(this.props.postKey).child('likers').orderByChild("user").equalTo(firebase.auth().currentUser.uid)
            .once("value", snapshot => {
                if (snapshot.exists()) { this.setState(prevState => ({ liked: !prevState.liked })) }
            });
    }
    setCommentModalVisible(visible) { this.setState({ commentsModalVisible: visible }); }
    setLikersModalVisible(visible) { this.setState({ likersModalVisible: visible }); }
    setEditCommentModalUnVisible() { this.setState({ editCommentModalVisible: false }); }
    likeNumberIncrement
    like = () => {
        this.db.ref('posts').child(this.props.postKey)
            .on('value', snap => { this.likeNumberIncrement = snap.val().likesNumber })
        if (this.state.liked) {
            this.likeNumberIncrement = this.likeNumberIncrement + 1
            this.db.ref(`posts/${this.props.postKey}/likesNumber`).set(this.likeNumberIncrement)
            this.db.ref('posts').child(this.props.postKey).child('likers').push({ user: firebase.auth().currentUser.uid })
                .catch(error => {
                    alert(error.toString())
                    return
                })
        }
        else {
            this.likeNumberIncrement = this.likeNumberIncrement - 1
            this.db.ref(`posts/${this.props.postKey}/likesNumber`).set(this.likeNumberIncrement)
            this.db.ref(`posts/${this.props.postKey}/likers`)
                .orderByChild('user')
                .equalTo(firebase.auth().currentUser.uid)
                .once('value', results => {
                    results.forEach((snapshot) => {
                        this.liker = snapshot.key
                    });
                })
                .then(
                    this.db.ref('posts')
                        .child(this.props.postKey)
                        .child('likers').child(this.liker).remove()
                )
                .catch(error => {
                    alert(error.toString())
                    return
                })
        }
        this.setState(prevState => ({ liked: !prevState.liked }))
    }
    makeCommentIncrement
    makeComment = () => {
        this.db.ref('posts').child(this.props.postKey)
            .on('value', snap => { this.makeCommentIncrement = snap.val().commentsNumber })
        this.makeCommentIncrement = this.makeCommentIncrement + 1
        this.db.ref(`posts/${this.props.postKey}/commentsNumber`).set(this.makeCommentIncrement)
            .then(() => {
                this.db.ref('posts').child(this.props.postKey).child('comments').push({
                    user: firebase.auth().currentUser.uid,
                    commentTxt: this.state.commentTxt,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                })
                this.setState({ commentTxt: '' })
            }
            )
            .catch(error => {
                alert(error.toString())
                return
            })
    }
    likersHandler = () => {
        this.db.ref(`posts/${this.props.postKey}/likers`)
            .on('value', snap => {
                var likers = []
                snap.forEach(liker => {
                    this.db.ref('authenticatedUsers').child(liker.val().user).on('value', user => {
                        likers.push({
                            userName: user.val().fullName,
                            userAvatar: user.val().avatar,
                            userKey: liker.val().user
                        })
                        this.setState({ likers })
                    })
                })
            })
    }
    commentHandler = () => {
        this.db.ref(`posts/${this.props.postKey}/comments`)
            .on('value', snap => {
                var comments = []
                snap.forEach(comment => {
                    this.db.ref('authenticatedUsers').child(comment.val().user).on('value', user => {
                        comments.push({
                            commentTxt: comment.val().commentTxt,
                            userName: user.val().fullName,
                            userAvatar: user.val().avatar,
                            commentKey: comment.key,
                            userKey: comment.val().user,
                        })
                        this.setState({ comments })
                    })
                })
            })
    }
    setEditCommentModalVisible = (item) => {
        this.setState({
            editComment: item.commentTxt,
            editCommentKey: item.commentKey,
            editCommentModalVisible: true
        })
    }
    editComment = () => {
        this.db
            .ref(`posts/${this.props.postKey}/comments/${this.state.editCommentKey}`)
            .once('value', snapshot => {
                if (this.state.editComment === snapshot.val().commentTxt) {
                    this.setState({ editCommentModalVisible: false })
                }
                else {
                    this.db
                        .ref(`posts/${this.props.postKey}/comments/${this.state.editCommentKey}/commentTxt`)
                        .set(this.state.editComment)
                    this.setState({ editCommentModalVisible: false })
                }
            })
    }
    deleteComment = (item) => {
        Alert.alert("Delete Comment", "Would you like to delete this comment ?", [
            {
                text: "Delete",
                onPress: () => {
                    firebase.database().ref('posts').child(this.props.postKey)
                        .once('value', snap => { this.makeCommentIncrement = snap.val().commentsNumber })
                    this.makeCommentIncrement = this.makeCommentIncrement - 1
                    firebase.database().ref(`posts/${this.props.postKey}/commentsNumber`).set(this.makeCommentIncrement)
                    firebase.database().ref(`posts/${this.props.postKey}/comments/${item.commentKey}`).remove()
                        .catch(error => {
                            alert(error.toString())
                            return
                        })
                }
            },
            {
                text: "Cancel",
                onPress: () => console.log("Comment deletion has been canceled by user")
            }
        ])
    }
    deletePost = () => {
        Alert.alert("Delete Post", "Would you like to delete this post ?", [
            {
                text: "Delete",
                onPress: () => {
                    this.db.ref(`posts/${this.props.postKey}`).remove()
                        .catch(error => {
                            alert(error.toString())
                            return
                        })
                }
            },
            {
                text: "Cancel",
                onPress: () => console.log("Post deletion has been canceled by user")
            }
        ])
    }
    editPost = () => {
        this.navigate('EditPost', {
            postKey: this.props.postKey,
            postText: this.props.postText,
            postImages: this.props.postImages
        })
    }
    render() {
        const renderComment = (item) => (
            <View style={{ flexDirection: 'row', borderColor: '#555', borderRadius: 5, borderWidth: 0.5, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 10 }}>
                <TouchableOpacity>
                    <Avatar
                        rounded
                        size={40}
                        source={{ uri: item.userAvatar }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.userName}</Text>
                    <Text>{item.commentTxt}</Text>
                </View>
                <View style={{ position: 'relative', right: 15 }}>
                    <Pop
                        dark
                        size={25}
                        item1='Edit' onPress1={() => { this.setEditCommentModalVisible(item) }}
                        item2='Delete' onPress2={() => { this.deleteComment(item) }}
                    />
                </View>
            </View>
        )
        const renderLikers = (item) => (
            <View style={{ flexDirection: 'row', borderColor: '#555', borderRadius: 5, borderWidth: 0.5, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 10 }}>
                <TouchableOpacity>
                    <Avatar
                        rounded
                        size={40}
                        source={{ uri: item.userAvatar }}
                    />
                </TouchableOpacity>
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 1 }}>
                    <TouchableOpacity>
                        <Text style={{ fontWeight: 'bold' }}>{item.userName}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
        return (
            <View style={{ marginBottom: 10 }}>
                <View style={{ position: 'absolute', right: 20, top: 20, zIndex: 1 }}>
                    {this.props.postMakerKey === this.currentUser
                        ? <Pop
                            dark
                            size={25}
                            item1='Edit' onPress1={this.editPost}
                            item2='Delete' onPress2={this.deletePost}
                        />
                        : <Pop
                            dark
                            size={25}
                            item1='Hide' onPress1={() => Alert.alert("Hide Post")}
                            item2='Report' onPress2={() => Alert.alert("ٌReport Post")}
                        />
                    }
                </View>
                <View style={styles.post}>
                    <View style={styles.userDetails}>
                        <Avatar
                            rounded
                            size={50}
                            source={{ uri: this.props.userAvatar }}
                        />
                        <Text style={styles.userName}>{this.props.userName}</Text>
                        <View style={styles.communities}>{this.communities.map(item =>
                            <TouchableOpacity onPress={() => Alert.alert('Navigate to Community')}>
                                <Text style={styles.commName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.navigate('EditPost', { communityKey: this.props.communityKey, postKey: this.props.postKey, postText: this.props.postText })
                        }}>
                        <Text style={styles.postText}>{this.props.postText}</Text>
                        {this.props.postImages ?
                            <SliderBox
                                images={this.props.postImages}
                                parentWidth={Dimensions.get('window').width * .90}
                            /> : null}
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.setLikersModalVisible(true); }}>
                        <Text>{this.props.likesNumber} likes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.setCommentModalVisible(true); }}>
                        <Text>{this.props.CommentsNumber} comments</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.postReactions}>
                    <TouchableOpacity style={styles.reaction} onPress={() => this.like()}>
                        <Icon name='heart-o' type='font-awesome' size={22} color='#555' />
                        <Text style={styles.reactionText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reaction} onPress={() => { this.setCommentModalVisible(true); }}>
                        <Icon name='comment-o' type='font-awesome' size={22} color='#555' />
                        <Text style={styles.reactionText}>Comment</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    visible={this.state.likersModalVisible}
                    onShow={this.likersHandler}
                    presentationStyle="formSheet "
                    onRequestClose={() => { this.setLikersModalVisible(false); }}
                >
                    <View style={{ backgroundColor: '#000000D9', flex: 1 }}>
                        <View style={styles.commentsContainer}>
                            <FlatList
                                style={{ marginTop: 10, marginHorizontal: 10 }}
                                data={this.state.likers}
                                keyExtractor={(item) => item.userKey}
                                renderItem={({ item }) => renderLikers(item)}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    //transparent={true}
                    visible={this.state.commentsModalVisible}
                    onShow={this.commentHandler}
                    presentationStyle="formSheet "
                    onRequestClose={() => { this.setCommentModalVisible(false); }}
                >
                    <View style={{ backgroundColor: '#000000D9', flex: 1 }}>
                        <View style={styles.commentsContainer}>
                            <FlatList
                                style={{ marginTop: 10, marginHorizontal: 10 }}
                                data={this.state.comments}
                                keyExtractor={(item) => item.commentKey}
                                renderItem={({ item }) => renderComment(item)}
                            />
                            <View style={{ alignItems: 'center', backgroundColor: '#fff', position: 'absolute', flexDirection: 'row', bottom: 10, left: 10, right: 10, }}>
                                <View style={styles.commentInputContainer}>
                                    <TextInput
                                        style={styles.commentInput}
                                        placeholder="Type something ... "
                                        placeholderTextColor='#888'
                                        autoCapitalize="none"
                                        value={this.state.commentTxt}
                                        multiline={true}
                                        numberOfLines={1}
                                        onChangeText={commentTxt => this.setState({ commentTxt })}
                                    />
                                </View>
                                <TouchableOpacity onPress={this.makeComment}>
                                    <Icon name='arrow-up' type='font-awesome' size={22} color='#555' />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    //transparent={true}
                    visible={this.state.editCommentModalVisible}
                    //onShow={this.editcommentHandler}
                    presentationStyle="formSheet "
                    onRequestClose={() => { this.setEditCommentModalUnVisible(); }}
                >
                    <View style={{ backgroundColor: '#000000D9', flex: 1 }}>
                        <View style={styles.commentsContainer}>
                            <View style={styles.postContainer}>
                                <TextInput style={styles.post}
                                    placeholder="Type something ... "
                                    placeholderTextColor='#888'
                                    autoCapitalize="none"
                                    value={this.state.editComment}
                                    multiline={true}
                                    numberOfLines={3}
                                    onChangeText={editComment => this.setState({ editComment })} />
                            </View>
                            <View style={styles.iconsContainer}>
                                <TouchableOpacity style={styles.icon} onPress={this.pickImage}>
                                    <Icon name='picture-o' type='font-awesome' size={25} color='#555' />
                                </TouchableOpacity>
                                <View style={styles.iconSeparator}></View>
                                <TouchableOpacity style={styles.icon}>
                                    <Icon name='camera' type='font-awesome' size={25} color='#555' />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.submitBtn} onPress={this.editComment}>
                                <Text style={styles.submitBtnTxt}>EDIT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    post: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#CCC',
    },
    userDetails: {
        flexDirection: 'row',
        //alignItems: 'center'
    },
    userName: {
        position: 'relative',
        left: 8, top: 5,
        fontWeight: 'bold',
        fontSize: 15
    },
    communities: {
        position: 'absolute',
        left: 58, top: 28,
        flex: 1,
        flexDirection: 'row',
    },
    commName: {
        color: '#00F',
        marginRight: 7,
    },
    postText: {
        padding: 15,
        textAlign: 'center',
        fontSize: 20,
    },
    postReactions: {
        padding: 10,
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderWidth: 1,
        //borderTopWidth: 0,
        borderColor: '#CCC',
        alignItems: 'center',
    },
    reaction: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 21
    },
    reactionText: {
        color: '#555',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 5
    },
    commentsContainer: {
        marginTop: 100,
        //marginHorizontal:5,
        backgroundColor: '#fff',
        flex: 1,
        borderWidth: 2,
        borderColor: 'orange',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10
    },
    commentInputContainer: {
        borderWidth: 0.5,
        borderColor: '#555',
        borderRadius: 30,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 5,
        alignItems: 'center',
        flex: 1,
        marginRight: 5,
    },
    commentInput: {
        fontSize: 17,
        flex: 1,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555'
    },
    iconSeparator: {
        width: 1,
        backgroundColor: '#555'
    },
    icon: {
        margin: 15
    },
    submitBtn: {
        backgroundColor: '#555',
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
    }
})
