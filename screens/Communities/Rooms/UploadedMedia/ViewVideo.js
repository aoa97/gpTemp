import React from 'react'
import { View, StyleSheet, StatusBar, FlatList, TouchableHighlight, Image, Text } from 'react-native'
import VideoPlayer from 'expo-video-player'
import { Video } from 'expo-av'


export default class ViewVideo extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'stretch' }}>
                <StatusBar hidden={true} />
                <VideoPlayer
                    videoProps={{
                        shouldPlay: true,
                        resizeMode: Video.RESIZE_MODE_CONTAIN,
                        source: {
                            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        },
                    }}
                    inFullscreen={true}
                />
            </View>
        )
    }
}