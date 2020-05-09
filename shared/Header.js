import React from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { Icon, Avatar } from 'react-native-elements'
import { secondColor } from '../shared/constants'

export default class Header extends React.Component {
    render() {
        if (this.props.center)
            return (
                <View style={styles.header}>
                    <TouchableOpacity style={styles.icon} onPress={this.props.onPress}>
                        <Icon name={this.props.icon} type={this.props.type} size={28} color='#fff' />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{this.props.title}</Text>
                    <TouchableOpacity style={styles.icon2} onPress={this.props.onPress2}>
                        <Icon name={this.props.icon2} type={this.props.type2} size={28} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon3} onPress={this.props.onPress3}>
                        <Icon name={this.props.icon3} type={this.props.type3} size={28} color='#fff' />
                    </TouchableOpacity>
                </View>
            )
        else if (this.props.avatar)
            return (
                <View style={styles1.header}>
                    <View style={{position: 'relative', left: 10}}>
                        <Avatar
                            rounded
                            size={40}
                            source={{uri: this.props.avatar}}
                            containerStyle={{borderWidth: 1, borderColor: '#FFF'}}
                        />
                    </View>
                    <Text style={styles1.headerText}>{this.props.title}</Text>
                    <TouchableOpacity style={styles1.icon} onPress={this.props.onPress} >
                        <Icon name={this.props.icon} type={this.props.type} size={28} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.icon2} onPress={this.props.onPress2}>
                        <Icon name={this.props.icon2} type={this.props.type2} size={28} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.icon3} onPress={this.props.onPress3}>
                        <Icon name={this.props.icon3} type={this.props.type3} size={28} color='#fff' />
                    </TouchableOpacity>
                </View>
            )
        else
            return (
                <View style={styles1.header}>
                    <Text style={styles1.headerText}>{this.props.title}</Text>
                    <TouchableOpacity style={styles1.icon} onPress={this.props.onPress} >
                        <Icon name={this.props.icon} type={this.props.type} size={28} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.icon2} onPress={this.props.onPress2}>
                        <Icon name={this.props.icon2} type={this.props.type2} size={28} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles1.icon3} onPress={this.props.onPress3}>
                        <Icon name={this.props.icon3} type={this.props.type3} size={28} color='#fff' />
                    </TouchableOpacity>
                </View>
            )
    }
}


const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: secondColor,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#FFF',
        letterSpacing: 1,
        textAlign: 'center',
        flex: 1,
    },
    icon: {
        position: 'absolute',
        left: 16,
        zIndex: 1
    },
    icon2: {
        position: 'absolute',
        right: 16,
    },
    icon3: {
        position: 'absolute',
        right: 48,
        marginRight: 10,
    }
})

const styles1 = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: secondColor,
        paddingLeft: 5
    },
    headerText: {
        marginLeft: 16,
        fontWeight: 'bold',
        fontSize: 22,
        color: '#FFF',
        letterSpacing: 1,
    },
    icon: {
        position: 'absolute',
        right: 16,
    },
    icon2: {
        position: 'absolute',
        right: 48,
        marginRight: 10,
        color: '#fff'
    },
    icon3: {
        position: 'absolute',
        right: 90,
        marginRight: 10,
        color: '#fff'
    }
})