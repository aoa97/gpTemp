 
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class PopMenu extends React.PureComponent {
    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity onPress={this.showMenu}>
                            <Icon name='kebab-horizontal' type='octicon' color='#FFF' size={20} />
                        </TouchableOpacity>
                    }
                >
                    <MenuItem onPress={() => {
                        this.props.onPress1()
                        this.hideMenu()
                    }}>{this.props.item1}</MenuItem>
                    <MenuItem onPress={() => {
                        this.props.onPress2()
                        this.hideMenu()
                    }}>{this.props.item2}</MenuItem>
                </Menu>
            </View>
        );
    }
}

export default PopMenu;