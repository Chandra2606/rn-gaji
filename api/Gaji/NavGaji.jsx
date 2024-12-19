import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import FormInput from './FormInput';
import DataGaji from './DataGaji';
import DetailGaji from './DetailData';
export default function NavGaji() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#B67352"
        translucent={true}
      />

      <Stack.Navigator initialRouteName="DataGaji">
        <Stack.Screen
          name="DataGaji"
          component={DataGaji}
          options={{
            headerTitle: 'Data Gaji',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="DetailData"
          component={DetailGaji}
          options={{
            headerTitle: 'Detail Gaji',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
          }}
        />
        <Stack.Screen
          name="FormInput"
          component={FormInput}
          options={{
            headerTitle: 'Input Gaji',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({});
