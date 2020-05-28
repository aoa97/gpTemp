import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native';
/*onPress={() => onSelect(id)} */
export function Item({ name, selected , onSelect }) {
    return (
        <TouchableOpacity
            onPress = {onSelect}
            style={[
                styles.item,
                { backgroundColor: selected ? '#e0ffa8' : '#7077ff' },
            ]}>
            <Text style={styles.title}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#e8ffbf',
        padding: 5,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 16,
    },
});