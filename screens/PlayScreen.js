import React from 'react'
import { View, Text, StatusBar, StyleSheet } from 'react-native'
import { SliderBox } from "react-native-image-slider-box";

export default class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
                "https://source.unsplash.com/1024x768/?nature",
                "https://source.unsplash.com/1024x768/?water",
                "https://source.unsplash.com/1024x768/?girl",
                "https://source.unsplash.com/1024x768/?tree", // Network image
            ]
        };
    }
    render() {
        return (
            <View style={{ marginTop: 50, flex: 1 }}>
                <SliderBox images={this.state.images} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DDD',
        width: '90%',
        height: '50%'
    }
})