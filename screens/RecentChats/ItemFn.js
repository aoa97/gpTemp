import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function Item({ id,  chatName, user, lstMsg }) {
    let avatar = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/woozy-1553631153.jpg?crop=0.352xw:0.626xh;0.325xw,0.187xh&resize=480:*'
    return (
        <View >
            <TouchableOpacity style = {styles.chatItem}>
                <View style={{ flexDirection: 'row'}}>
                    <Image source={{ uri: avatar }} style={styles.image} />
                    <View style= {{paddingLeft: 10}}>
                        <Text style={{fontWeight: 'bold' , paddingBottom: 5}}>{chatName}</Text>
                        <Text style={{color: 'blue'}} >{user}:  {lstMsg}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {paddingTop: Constants.statusBarHeight, 
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 15
    }, 
    chatItem:{
        backgroundColor:'#e3e3e3', 
        margin: 2,
        padding: 5
    }
})