import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ion from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Data() {
  const [dataPaket, setDataPaket] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  //memanggil api
  const fetchdataPaket = async (pageNumber = 1, searchQuery = search) => {
    let token = await AsyncStorage.getItem('userToken');
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}jabatan?page=${pageNumber}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      setPage(pageNumber);
      setLastPage(json.meta.last_page);

      setDataPaket(pageNumber === 1 ? json.data : [...dataPaket, ...json.data]);
    } catch (error) {
      setError(`Tidak bisa mengambil data : ${error}`);
    } finally {
      setLoading(false);
      if (pageNumber === 1) {
        setRefreshing(false);
      }
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    fetchdataPaket(1, search);
  };

  const clearSearch = () => {
    setIsSearching(false);
    fetchdataPaket(1, '');
    setSearch('');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchdataPaket(1, search).finally(() => setRefreshing(false));
  };

  let token;
  useEffect(() => {
    checkToken();
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.dataAdded) {
        checkToken();
      }
    });
    return unsubscribe;
  }, [navigation, route.params?.dataAdded]);

  const checkToken = async () => {
    token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.navigate('Login');
    } else {
      fetchdataPaket();
    }
  };

  const rederItemMatakuliah = ({item}) => {
    const showDetailData = () => {
      navigation.navigate('DetailJabatan', {
        kdjabatan: item.kdjabatan,
      });
    };
    return (
      <TouchableOpacity style={styles.item} onPress={showDetailData}>
        <Text style={styles.title}>{item.namajabatan}</Text>
        <Text style={styles.nim}>{item.kdjabatan}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Berdasarkan Kode Atau Nama"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        {isSearching && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => clearSearch()}
            style={styles.button}>
            <Text style={styles.buttonText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading && page === 1 && <ActivityIndicator size="large" color="blue" />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={dataPaket}
        renderItem={rederItemMatakuliah}
        keyExtractor={item => item.kdjabatan}
        extraData={loading || error}
        onEndReached={() => {
          if (!loading && page < lastPage) {
            fetchdataPaket(page + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          !loading || page === 1 ? null : (
            <ActivityIndicator size={'large'} color="#860A35" />
          )
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate('FormTambah');
        }}>
        <Ion name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#EFEFEF',
  },
  searchInput: {
    marginTop: 10,
    height: 55,
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 35,
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  item: {
    backgroundColor: '#B67352',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 4,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    color: '#DDF2FD',
  },
  nim: {
    color: '#DDF2FD',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    color: '#555555',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
  },

  detailButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 10,
  },

  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    elevation: 8,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
  },
});
