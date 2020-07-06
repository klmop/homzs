import React from 'react';
import { View, Text } from 'react-native';
import THStyles from '../constants/THStyles';
import THConstants from '../constants/THConstants';

const Copyright = () => {
    return(
        <View style={THStyles.copyrightContainer}>
            <Text style={THStyles.copyrightText}>{THConstants.copyrightText}</Text>
        </View>);
}
export default Copyright;