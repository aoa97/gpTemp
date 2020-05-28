
// Missing CheckBox and giving premissions to the bot
import React from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TextInput,
    Text,
    FlatList,
    Button,
    ScrollView,
    TouchableHighlightBase,
    ActivityIndicator
} from 'react-native'
import * as firebase from 'firebase'

import Constants from 'expo-constants';
import { Item } from './FlatListRender'

console.disableYellowBox = true;
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        margin: 30,
        padding: 10,
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    item: {
        backgroundColor: '#e8ffbf',
        padding: 5,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 16,
    }
})

export default class SecondPageLaunch extends React.Component {
    constructor() {
        super();
        this.state = {
            botName: '',
            Type: '',
            premissions: [],
            userPremissions: [],
            counter: 0,
            premNames: '',
            MiniPremissions: true,
            retrieved: false
        }
    }
    /* premissions: [0 , true] */

    toggleErrorFlag(counter) {
        if (counter >= 3) {
          this.setState({ MiniPremissions: false })
        }
        else {
          this.setState({ MiniPremissions: true })
        }
      }

    /*Checker = () => {
        this.toggleErrorFlag(this.state.PremissionCounter)
        this.setState(prevState => ({ PremissionCounter: prevState.PremissionCounter + 1 }))
    }*/

    handleBotLaunching = () => {
        const { botName, Type } = this.props.navigation.state.params
        const { premissions, PremissionCounter } = this.state
        this.uploadToRealTimeDatabase(botName, Type, premissions)
        const { navigate } = this.props.navigation;
        navigate('DialogFlowChatBotScreen')
    }

    uploadToRealTimeDatabase(name, Type, premissions) {

        let sortedPremArr = premissions
        sortedPremArr.sort(this.compareValues('id'))
        let Bot = 'rooms/Bots/' + name
        firebase.database().ref(Bot).set({
            name,
            Type,
            sortedPremArr,
        }).catch((error) => {
            console.log('error ', error)
        })
    }

    compareValues(key, order = 'asc') { //Object sorting function
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
          }
    
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
    
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
      }

    componentDidMount() {
        let address = 'App/Presets/Bots/Premissions'
        let premissions = []
        firebase.database().ref(address).on('value', snap => {
            snap.forEach(child => {
                premissions.push({
                    key: child.key,
                    selected: false,
                    id: child.val().id
                })
            })

            this.setState({ premissions: premissions, retrieved: true })
        })
    }

    onSelect = (id) => {
        let userPremissions = []
        this.state.premissions.forEach(child => {
            if (child.id == id) {
                userPremissions.push({
                    key: child.key,
                    id: child.id,
                    selected: !child.selected
                })
                if (!child.selected) {
                    this.setState(prevState => ({
                        counter: prevState.counter + 1,
                        premNames: prevState.premNames + " " + child.key
                    })
                    )
                    this.toggleErrorFlag(this.state.counter)
                }
                else {
                    if (this.state.counter != 0) {
                        this.setState(prevState => ({ counter: prevState.counter - 1 }))
                        this.toggleErrorFlag(this.state.counter)
                        let prem = this.state.premNames.replace(child.key, '')
                        this.setState({ premNames: prem })
                        if (this.state.premNames[0] == ' ') {
                            let l = this.state.premNames.length
                            this.setState(prevState => ({
                                premNames: prevState.premNames.substr(1, l)
                            }))
                        }
                    }
                }
            }
            else {
                userPremissions.push({
                    key: child.key,
                    id: child.id,
                    selected: child.selected
                })
            }
        })
        this.setState({ premissions: userPremissions })
    }

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' enabled>
                <Text style={{ marginLeft: 30, marginRight: 30, marginTop: 30 }} >BOT Premissions</Text>
                <ScrollView style={{ marginLeft: 30, marginRight: 30, borderWidth: 1, padding: 5, height: 250 }}>
                    {this.state.retrieved?
                    <FlatList
                        data={this.state.premissions}
                        renderItem={({ item }) => (
                            <Item
                                name={item.key}
                                selected={item.selected}
                                onSelect={() => this.onSelect(item.id)}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                    :
                    <ActivityIndicator size='large' collor='red' style={{padding :100}}/>}
                </ScrollView>
                <View style ={{padding : 10, alignItems:'center'}}>
                    <Text style={{textAlign: 'center', fontWeight:'bold', color:'blue'}}>{this.state.premNames}</Text>
                    <Text>premissions Number</Text> 
                    <Text style={{fontWeight:'bold'}}>{this.state.counter}</Text>
                </View>
                <View style={{ padding: 60, width: 200, marginLeft: 100 }}>
                    <Button
                        onPress={this.handleBotLaunching}
                        disabled={this.state.MiniPremissions}
                        title='Launch' />
                </View>

            </KeyboardAvoidingView>
        )
    }
}

/* keyExtractor={item => item.id}
extraData={selected} */
/*
selected={!!selected.get(item.id)}
onSelect={onSelect}*/

