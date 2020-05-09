import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, Alert } from "react-native";

export default function Item({ userId, timestamp, Bubble, likes, navigate ,comments }) {
    let avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRjiFixXCtFlh6Shlj89HpmVUZTQDvHwhIqJv75dCELlTPryUkYQ&s'
  
    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.bubblee}>
                    <Image source={{ uri: avatar }} style={styles.image} />
                    <Text style={styles.Username}>{userId}</Text>
                    <Text style={styles.Username}>{timestamp}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.Bubble}
                onPress={navigate}>
                <Text>{Bubble}</Text>
            </TouchableOpacity>
            <View style={styles.fixToText}>
                <TouchableOpacity>
                    <Text>{likes} Likes </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text> {comments} Comments </Text>
                </TouchableOpacity>
            </View>
        </View>
    )



}
const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        borderRadius: 15
    },
    container: {
        margin: 2,
        padding: 5,
        backgroundColor: '#E2E2E2',
        borderRadius: 15
    },
    bubblee: {
        flexDirection: 'row',
        paddingLeft: 5,
        paddingTop: 5,


    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        paddingBottom: 15
    },
    Username: {
        fontWeight: 'bold',
        fontSize: 10,
        color: 'black',
        paddingTop: 5,
        paddingLeft: 10
    },
    Bubble: {
        color: '#5e64c1',
        paddingTop: 15,
        paddingLeft: 5,
    }
})      