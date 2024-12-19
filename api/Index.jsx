import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Pelanggan from './Karyawan/Navigasi';
import Jabatan from './Jabatan/Navigasi';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DataUser from './DataUser';
import NavGaji from './Gaji/NavGaji';

const Tab = createBottomTabNavigator();

export default function Index(props) {
  const {setUserToken} = props;
  return (
    <Tab.Navigator
      initialRouteName="Pelanggan"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Pelanggan') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else if (route.name === 'Jabatan') {
            iconName = focused ? 'folder-open' : 'folder-open-outline';
          } else if (route.name === 'UserAccount') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          } else if (route.name === 'Gaji') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }
          return <IonIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#B67352',
        tabBarInactiveTintColor: '#164863',
      })}>
      <Tab.Screen
        name="Pelanggan"
        component={Pelanggan}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Jabatan"
        component={Jabatan}
        options={{headerShown: false}}
      />

      <Tab.Screen
        name="Gaji"
        component={NavGaji}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="UserAccount"
        options={{headerShown: false, title: 'Keluar'}}>
        {props => <DataUser {...props} setUserToken={setUserToken} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
