import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Data from './Data';
import DetailData from './Detaildata';
import {StatusBar} from 'react-native';
import FormTambah from './FormTambah';
import FormEdit from './FormEdit';

export default function Navigasi() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#B67352"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataJabatan">
        <Stack.Screen
          name="DataJabatan"
          component={Data}
          options={{
            headerTitle: 'Data Jabatan',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
          }}
        />
        <Stack.Screen
          name="DetailJabatan"
          component={DetailData}
          options={{
            headerTitle: 'Detail Jabatan',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
          }}
        />
        <Stack.Screen
          name="FormTambah"
          component={FormTambah}
          options={{
            headerTitle: 'Tambah Jabatan',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
          }}
        />
        <Stack.Screen
          name="FormEdit"
          component={FormEdit}
          options={{
            headerTitle: 'Edit Jabatan',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
