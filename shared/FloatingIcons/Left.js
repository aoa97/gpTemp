import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { secondColor } from '../constants';

export default class RightFloatingIcon extends Component {
    clickHandler = () => {
        //function to handle click on floating Action Button
        Alert.alert('Floating Button Clicked');
    };

    render() {
        return (
            <TouchableOpacity style={styles.rightIcon} activeOpacity={0.7} onPress={this.props.onPress}>
                <View style={styles.FloatingButtonStyle}>
                    <Icon
                        type={this.props.type}
                        name={this.props.icon}
                        color='#FFF'
                        size={40}
                    />
                </View>
            </TouchableOpacity >
        );
    }
}

const styles = StyleSheet.create({
    rightIcon: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        left: 30,
        bottom: 70,
        zIndex: 1
    },

    FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        alignItems: 'center', flex: 1,
        justifyContent: 'center',
        backgroundColor: secondColor
    },
});