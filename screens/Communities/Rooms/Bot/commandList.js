import React from 'react'
import { Text, Button, View, ScrollView, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
//import CommandRow from './CommandRow';
import { infoBotList, musicBotList, partiesBotList } from './Lists'
import { colors } from 'react-native-elements'

console.disableYellowBox = true
let list = infoBotList

const Styles = StyleSheet.create({
    Main: {
        borderWidth: 1,
    },
    CommandSection: { borderWidth: 1 }
})

export function CommandRow({ name, title, navigator }) {

    return (
        <View style={Styles.Main}>
            <View>
                <Text>{name}</Text>
                <Text>{title}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={navigator}>
                    <Text>{name}</Text>
                    <Text>Press to try</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default class commandList extends React.Component {
    constructor() {
        super();
        this.state = {
            msg: 'Commands Returned from firebase Query',
            Type: 'infoBot',
            commandId: 0,
        }
    }

    navigator = () => {
        const { navigate } = this.props.navigation
        let { Type } = this.state
        let { commandId } = this.state
        navigate('chatBot', { Type, commandId })
    }
    
    render() {
        return (
            <View style={{ padding: 20 }}>
                <ScrollView>
                    <FlatList
                        data={list}
                        renderItem={({ item }) => (
                            <CommandRow
                                name={item.name}
                                subtitle={item.subtitle}
                                navigator={this.navigator}
                            />
                        )}
                    />
                </ScrollView>
            </View>
        )
    }
}