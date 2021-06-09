/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button
} from 'react-native';
import md5 from 'js-md5'
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const createUrl = 'http://127.0.0.1:2000/rec/report'
const delUrl = 'http://127.0.0.1:2000/rec/clear'
const App = () => {
  const [value, onChangeText] = useState('');
  const create = () => {
    axios.post(createUrl , {
      sign : '',
      timestamp : '',
      did : '' ,
      date : ''
    })
  }
  const onDelete = () => {
    axios.post(delUrl , {
      sign : '',
      timestamp : '',
      did : '' ,
      date : ''
    })
  }
  return (
    <View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => onChangeText(text)}
        value={value}
      />
      <Button 
       onPress={create}
       title="生成报告"
       color="#841584"
       accessibilityLabel="Learn more about this purple button"
      />
      <Button 
       onPress={onDelete}
       title="删除报告"
       color="#841584"
       accessibilityLabel="Learn more about this purple button"
      />
    </View>
  )
}

export default App;
