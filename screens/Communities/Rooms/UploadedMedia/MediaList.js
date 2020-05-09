import React from 'react'
import { View, StyleSheet, StatusBar, FlatList, TouchableHighlight, Image, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { Video } from 'expo-av';
import firebase from '../../../../services/firebaseConfig'
import Header from '../../../../shared/Header'

export default class Media extends React.Component {
    constructor(props) {
        super(props)
        this.communityKey = this.props.navigation.getParam('communityKey')
        this.roomKey = this.props.navigation.getParam('roomKey')
        this.state = {
            images: []
        }
    }

    componentDidMount() {
        firebase.database().ref(`rooms/${this.communityKey}/${this.roomKey}/uploadedImages`).on('value', snap => {
            var images = []
            snap.forEach(child => {
                images.push({
                    image: child.val().image,
                    key: child.key
                })
            })
            this.setState({ images })
        })
    }

    render() {
        return (
            <View style={{ marginTop: StatusBar.currentHeight }}>
                <Header title='Media' />
                <View style={{ padding: 3 }}>
                    <FlatList
                        style={styles.list}
                        numColumns='3'
                        data={this.state.images}
                        keyExtractor={item => item.key}
                        renderItem={({ item }) =>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate("ImageView", { uri: item.image })}>
                                <Image source={{ uri: item.image }} style={styles.item} />
                            </TouchableHighlight>
                        }
                    />
                    {/* <View style={{ width: 115, height: 115, backgroundColor: '#DDD' }}>
                        <Video
                            source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            //shouldPlay
                            isLooping
                            style={{ width: 115, height: 115, backgroundColor: '#000', opacity: 0.7 }}
                        />
                        <TouchableHighlight onPress={() => this.props.navigation.navigate("VideoView")} style={{ position: 'absolute', bottom: 0, left: 2 }}>
                            <Icon name='play-circle' type='font-awesome' size={35} color='#FFF' />
                        </TouchableHighlight>
                    </View> */}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'column',
        marginTop: 5,
        margin: 1,
    },
    item: {
        width: 115,
        height: 115,
        marginBottom: 4,
        marginRight: 4,
    }
})