import React from "react";
import { View, TextInput, Text,Image ,StyleSheet } from "react-native";


export function Comment({ comment }) {
    let avatar = 'https://icon2.cleanpng.com/20180330/spw/kisspng-iphone-emoji-apple-ios-11-emojis-5abe1fe31ed9c6.7613688515224094431264.jpg'

    return (
        <View style={styles.commentSection}>
            <Image source={{ uri: avatar }} style={styles.image} />
            <Text style={{paddingLeft: 10, fontSize:14}}>{comment}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    commentSection: {
        padding: 10,
        borderRadius: 15, 
        borderColor: '#d3d3d3', 
        borderWidth: 1, 
        marginBottom: 5,
        flexDirection: 'row',
        
    }
})