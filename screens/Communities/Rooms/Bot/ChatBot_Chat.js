import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'



export default class ChatBot_Chat extends Component {
    constructor() {
        super();
        this.state = {
            txtMsg: ' Done ', 
            Type : 'infoBot' //Need to be dynamically Updated
        }
    }
    handleNavigation = () => {
        const { Type } = this.state
        const { navigate } = this.props.navigation
        navigate('commandList')
    }
    render() {
        return (
            <View>
                <Text style={{ flex: 1, flexDirection: 'column', fontWeight: 'bold' }}>
                    Launched
                </Text>
                <Button title='Show CommandList' onPress={this.handleNavigation} />
            </View>
        )
    }
}