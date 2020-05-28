import React from 'react'
import { View, Text, Button, Alert } from 'react-native'
import { infoBotList, musicBotList, partiesBotList } from './Lists'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import commandList from './commandList';
export default class chatBot extends React.Component {
    constructor() {
        super();
        this.state = {
            commandId: 1
        }
    }

    render() {
        const { Type , commandId } = this.props.navigation.state.params
        return (
            <View>
                <Text> Bot Chat screen with the command sent from user's side with params   { Type } ,  { commandId } </Text>
            </View>
        )
    }
}