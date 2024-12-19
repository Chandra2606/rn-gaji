import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Data from './Data';
import DetailData from './Detaildata';
import {StatusBar} from 'react-native';
import FormTambah from './FormTambah';
import FormEdit from './FormEdit';
import FormUpload from './FormUpload';

export default function Navigasi() {
  const Stack = createNativeStackNavigator();
  return (
    // <NavigationContainer independent={true}>
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#B67352"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataKaryawan">
        <Stack.Screen
          name="DataKaryawan"
          component={Data}
          options={{
            headerTitle: 'Data Karyawan Dan Guru',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
          }}
        />
        <Stack.Screen
          name="DetailKaryawan"
          component={DetailData}
          options={{
            headerTitle: 'Detail Karyawan Atua Guru',
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
            headerTitle: 'Tambah Karyawan Atau Guru',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="FormEdit"
          component={FormEdit}
          options={{
            headerTitle: 'Edit Karyawan Atau Guru',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#B67352',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="FormUpload"
          component={FormUpload}
          options={{
            headerTitle: 'Update Foto Karyawan Atau Guru',
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
