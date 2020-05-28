import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ViewPropTypes,
  Picker,
  Button,
  ScrollView,
  Alert
} from 'react-native'
import { infoBotList, musicBotList, partiesBotList } from './Lists'
import * as firebase from 'firebase'


console.disableYellowBox = true;
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    margin: 30,
    padding: 10
  },
})

function Item({ name, subtitle }) {
  return (
    <View style={{ margin: 2, borderWidth: 1, padding: 5, backgroundColor: '#d4ebff', borderColor: '#' }}>
      <TouchableOpacity>
        <Text style={{ color: 'blue' }}>{name}</Text>
        <Text style={{ color: 'grey' }}>{subtitle}</Text>
      </TouchableOpacity>
    </View>
  );
}

let list = infoBotList

export default class LaunchBot extends React.Component {
  constructor() {
    super();
    this.state = {
      botName: '',
      Type: 'infoBot',
      emptyNameError: true,
    }
  }

  handleNavigating = () => {
    const {navigate} = this.props.navigation
    /*let botName = this.state
    let Type = this.state*/
    navigate('SecondPageLaunch', {botName: this.state.botName , Type : this.state.Type })
  }

  toggleErrorFlag(name) {
    if (name.length >= 3) {
      this.setState({ emptyNameError: false })
    }
    else {
      this.setState({ emptyNameError: true })
    }
  }


  handleBotName = (name) => {
    this.setState({ botName: name })
    this.toggleErrorFlag(name)
  }

  handleBotType = (itemValue) => {
    this.setState({ Type: itemValue })

    if (this.state.Type === 'infoBot') {
      list = infoBotList
    }
    else if (this.state.Type === 'partiesBot') {
      list = partiesBotList
    }
    else if (this.state.Type === 'musicBot') {
      list = musicBotList
    }
  }


  render() {

    return (

      <KeyboardAvoidingView behavior='padding' enabled>

        <View>
          <Text style={{ marginLeft: 30, marginTop: 30 }}>BOT name</Text>
          <TextInput
            style={{ borderWidth: 1, marginLeft: 30, marginRight: 30 }}
            placeholder='Enter your Bot Name'
            onChangeText={(name) => this.handleBotName(name)}
          />
        </View>
        <Text style={{ marginLeft: 30, marginRight: 30, marginTop: 30 }} >BOT Type</Text>
        <View style={{ marginLeft: 30, marginRight: 30, borderWidth: 1 }}>
          <Picker mode='dropdown'
            selectedValue={this.state.Type}
            onValueChange={(itemValue) => { this.handleBotType(itemValue) }}>

            <Picker.Item label="Info BOT" value="infoBot" />
            <Picker.Item label="Parties Bot" value="partiesBot" />
            <Picker.Item label="Music Bot" value="musicBot" />

          </Picker>
        </View>
        <Text style={{ marginLeft: 30, marginRight: 30, marginTop: 30 }} >BOT Commands</Text>
        <ScrollView style={{ marginLeft: 30, marginRight: 30, borderWidth: 1, padding: 5, height: 250 }}>
          <FlatList
            data={list}
            renderItem={({ item }) => (
              <Item
                name={item.name}
                subtitle={item.subtitle}
              />
            )}
          />
        </ScrollView>
        <View style={{ padding: 60, width: 200, marginLeft: 100 }}>
          <Button
            onPress={this.handleNavigating}
            disabled={this.state.emptyNameError}
            title='Next' />
        </View>

      </KeyboardAvoidingView>
    )
  }
}