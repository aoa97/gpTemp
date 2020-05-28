import React from 'react';
import { View, TextInput, Button, Text, Alert, FlatList } from 'react-native';
import * as firebase from 'firebase';
import { premissionsDeny, accountNotFound } from './Errors.js';
import { defaultCommand } from './BotCommands.js';
const db = firebase.database();
const auth = firebase.auth();

export default class queryExample extends React.Component {
  constructor() {
    super();
    this.state = {
      a: '',
      premissions: [],
      result: '',
      comTip: '{-ask}{queryType}{User}{-SearchWord}',
      queryUser: '',
      keyWord: '',
      receiveData: [],
      multipleResults: false,
    };
  }
  detectBot = () => {
    let commandStart = this.state.a; //fetch command
    let commandArray = commandStart.split(' '); //split command
    let comFire = commandArray[0].toLowerCase(); //detect command
    let keyWord = commandArray[commandArray.length - 1].substr(1);
    if (comFire == defaultCommand) {
      commandArray.shift(); // remove com tip
      this.checkPremissions(keyWord, commandArray);
    }
  };

  checkPremissions = (keyWord, commandArray) => {
    let premissions = [
      'firstName',
      'midName',
      'lastName',
      'birthday',
      'nickName',
      'university',
    ];
    let premCheck = premissions.includes(keyWord);
    if (premCheck) {
      this.knowUser(commandArray, keyWord);
    } else {
      Alert.alert(premissionsDeny);
    }
  };
  knowUser = (commandArray, keyWord) => {
    //command example :- {-ask} {queryType} {firstName/Nickname}{secondName/LastName}{-SearchWord}

    let queryType = commandArray[0].toLowerCase();
    let queryUser1,
      queryUser2 = '';

    if (queryType == 'a') {
      queryUser1 = commandArray[1].toLowerCase();
      this.findUser(queryType, queryUser1, '', true, keyWord);
    } else if (queryType == 'b') {
      queryUser1 = commandArray[1].toLowerCase();
      queryUser2 = commandArray[2].toLowerCase();
      this.findUser(queryType, queryUser1, queryUser2, true, keyWord);
    } else if (queryType == 'c') {
      queryUser1 = commandArray[1].toLowerCase();
      queryUser2 = commandArray[2].toLowerCase();
      this.findUser(queryType, queryUser1, queryUser2, true, keyWord);
    } else if (queryType == 'd') {
      queryUser1 = commandArray[1].toLowerCase();
      this.findUser(queryType, queryUser1, '', false, keyWord);
    }
  };

  findUser = (queryType, queryUser1, queryUser2, fOrN, keyWord) => {
    let location = 'authenticatedUsers/'; //users of a room or a community mainly
    let data = [];
    let uuid = '';
    let address = '';
    db.ref(location).on('value', snap => {
      snap.forEach(child => {
        address = location + child.key + '/PersonalInfo/';
        db.ref(address).on('value', snapshot => {
          if (fOrN) {
            if (queryUser1 == snapshot.val().firstName.toLowerCase()) {
              if (queryType == 'a') {
                data.push((uuid = child.key));
              }
              if (queryUser2 != '') {
                if (
                  queryUser2 == snapshot.val().midName.toLowerCase() &&
                  queryType == 'b'
                ) {
                  data.push((uuid = child.key));
                  return;
                }
                if (
                  queryUser2 == snapshot.val().lastName.toLowerCase() &&
                  queryType == 'c'
                ) {
                  data.push((uuid = child.key));
                  return;
                }
              }
            }
          } else {
            if (queryUser1 == snapshot.val().nickName.toLowerCase()) {
              data.push((uuid = child.key));
            }
          }
        });
      });
    });
    if (data.length != 0) {
      this.expertBot(keyWord, data);
    } else {
      Alert.alert(accountNotFound);
    }
  };

  expertBot(keyWord, data) {
    let word = '';
    let address = '';
    let receiveData = [];
    if (keyWord == 'birthday') {
      word = 'birthday';
    } else if (keyWord == 'university') {
      word = 'University';
    } else if (keyWord == 'address') {
      word = 'address';
    } else if (keyWord == 'age') {
      word = 'age';
    } else if (keyWord == 'name') {
      word = 'name';
    } else if (keyWord == 'nickname') {
      word = 'nickname';
    } else if (keyWord == 'school') {
      word = 'school';
    } else if (keyWord == 'middle_name') {
      word = 'middle_name';
    } else if (keyWord == 'last_name') {
      word = 'last_name';
    }
    data.forEach(child => {
      address = 'authenticatedUsers/' + child + '/PersonalInfo/' + word;
      db.ref(address).on('value', snap => {
        receiveData.push({
          keyWord: keyWord,
          value: snap,
          uuid: child,
        });
      });
    });
    this.setState({ receiveData });
  }

  render() {
    let DATA = this.state.receiveData;
    return (
      <View>
        <TextInput
          style={{ borderWidth: 1, margin: 10 }}
          placeholder={this.state.comTip}
          onChangeText={text => this.setState({ a: text })}
        />
        <Button title="ask" onPress={this.detectBot} />
      </View>
    );
  }
} /**/
