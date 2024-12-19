import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import {apiUrl} from '../config';
import ActionButton from './ActionButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailMatkul = ({route}) => {
  const {kdjabatan} = route.params;
  const [paket, setPaket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
      const fetchData = async () => {
        let token = await AsyncStorage.getItem('userToken');
        try {
          const response = await fetch(`${apiUrl}jabatan/${kdjabatan}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();
          setPaket(json);
        } catch (error) {
          setError('Tidak dapat memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    });
    return unsubcribe;
  }, [navigation, kdjabatan]);
  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {paket && (
            <Card>
              <Card.Divider />
              <Text style={styles.detail}>Kode Jabatan:</Text>
              <Text style={styles.detailData}>
                {paket.kdjabatan}
              </Text>
              <Text style={styles.detail}>Nama Jabatan:</Text>
              <Text style={styles.detailData}>
                {paket.namajabatan}
              </Text>
              <Text style={styles.detail}>Gaji Pokok:</Text>
              <Text style={styles.detailData}>Rp. {paket.gapok}</Text>
              <Text style={styles.detail}>Tunjangan:</Text>
              <Text style={styles.detailData}>Rp. {paket.tunjangan}</Text>
            </Card>
          )}
        </View>
      </ScrollView>
      <ActionButton kdjabatan={paket.kdjabatan} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
    color: '#ccd',
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailData: {
    fontSize: 18,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
    fontWeight: 'bold',
  },
});
export default DetailMatkul;
