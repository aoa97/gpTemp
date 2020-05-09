import React from 'react'
import { ScrollView, FlatList, Button } from 'react-native'
import Item from './itemFn'
import * as firebase from 'firebase'
console.disableYellowBox = true

export default class Bubble extends React.Component {
    constructor() {
        super();
        this.state = {
            msg: 'bubble',
            selected: true,
            selectedPostId: 5,
            bubbles: [],
            roomName: 'dd'
        }
    }
    navigate = (userId, id, msg, likes) => {
        const { navigate } = this.props.navigation
        navigate('bubbleExtend',
            {
                selectedPostId: id,
                msgToBubble: msg,
                likes: likes,
                userId: userId
            })
    }
    async receiveBubble() {
        let bubbles = []
        let address = 'communities/rooms/ahmad/Bubbles'
        await firebase.database().ref(address).on('value', snap => {
            snap.forEach(child => {
                bubbles.push({
                    key: child.key,
                    RoomName: child.val().RoomName,
                    msgToBubble: child.val().msgToBubble,
                    userId: child.val().userId,
                    likes: Object.keys(child.val().Likes).length,
                    Comments: Object.keys(child.val().Comments).length,
                    timestamp: child.val().timestamp
                })
            })
        })
        this.setState({ bubbles: bubbles })
        console.log(bubbles)
    }

    render() {
        console.log(this.props.navigation.getParam('commKey'))
        console.log(this.props.navigation.getParam('roomKey'))
        return (
            <ScrollView>
                <Button title='Retrieve' onPress={this.receiveBubble.bind(this)} />
                <FlatList
                    data={this.state.bubbles}
                    renderItem={({ item }) => (
                        <Item
                            timestamp={item.timestamp}
                            userId={item.userId}
                            Bubble={item.msgToBubble}
                            onSelect={this.onSelect}
                            selected={this.state.selected}
                            navigate={() => this.navigate(item.userId, item.key, item.msgToBubble, item.likes)}
                            likes={item.likes}
                            comments={item.Comments}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </ScrollView>
        )

    }
}
