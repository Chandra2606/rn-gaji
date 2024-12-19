import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {Button, Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import ModalDataKaryawan from './ModalDataKaryawan';
import ModalDataJabatan from './ModalDataJabatan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../config';
import {useNavigation} from '@react-navigation/native';

export default function FormInput() {

  const navigation = useNavigation();
  const [modalKaryawanVisible, setModalKaryawanVisible] = useState(false);
  const [modalJabatanVisible, setModalJabatanVisible] = useState(false);
  const [kdgaji, setKdGaji] = useState('');
  const [tglmulai, setTglMulai] = useState(new Date());
  const [selectKaryawan, setSelectedKaryawan] = useState({kdkaryawan: '', nama: '', gapok:'', tunjangan:''});
  const [selectedJabatan, setSelectedJabatan] = useState({
    kode: '',
    nama: '',
    gapok:'',
    tunjangan:'',
  });
  const [showPicker, setShowPicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [keterangan, setKeterangan] = useState('');
  const [harga, setHarga] = useState('');
  const [tunjangan, setTunjangan] = useState('');
  const [bulan, setBulan] = useState('');
  const [total, setTotal] = useState('');
  const [bonus, setBonus] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);


   const calculateTotal = () => {
     const gp = parseFloat(selectedJabatan.gapok);
     const tj = parseFloat(selectedJabatan.tunjangan);
     const bs = parseFloat(bonus);
     if (!isNaN(gp) && !isNaN(tj) && !isNaN(bs)) {
       setTotal((gp + tj + bs).toString());
     }
   };

   useEffect(() => {
     calculateTotal();
   }, [selectedJabatan.gapok, selectedJabatan.tunjangan, bonus]);

  const onKaryawanSelected = (kdkaryawan, nama) => {
    setSelectedKaryawan({kdkaryawan, nama});
    setModalKaryawanVisible(false); // Menutup modal setelah pemilihan
  };
  const onJabatanSelected = (kode, nama, gapok,tunjangan) => {
    setSelectedJabatan({kode, nama, gapok,tunjangan});
    setModalJabatanVisible(false); // Menutup modal setelah pemilihan
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tglmulai;
    setDatePickerVisible(Platform.OS === 'ios');
    setTglMulai(currentDate);
  };
  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const modalSearchKaryawan = () => {
    setModalKaryawanVisible(true); // Buka hanya modal dosen
  };
  const modalSearchJabatan = () => {
    setModalJabatanVisible(true); // Buka hanya modal matakuliah
  };
  const submitServis = async () => {
    setLoading(true);
    setValidationErrors({});
    const dataToSend = {
      kdgaji: kdgaji, // Ambil dari state atau Input component
      karyawankd: selectKaryawan.kdkaryawan,
      jabatankd: selectedJabatan.kode,
      bulan:bulan,
      bonus:bonus,
      total:total,
    };
    let token = await AsyncStorage.getItem('userToken');
    fetch(`${apiUrl}gaji`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          // Jika ada kesalahan validasi, akan masuk ke sini
          if (response.status === 422) {
            // Handle validation errors
            let errors = {};
            Object.keys(data.errors).forEach(key => {
              errors[key] = data.errors[key][0]; // Ambil hanya pesan pertama untuk setiapfield;
            });
            setValidationErrors(errors);
          } else {
            throw new Error(
              data.message || 'Terjadi kesalahan saat menyimpan data.',
            );
          }
          return;
        }
        setLoading(false);
        Alert.alert('Berhasil', 'Data Gaji berhasil disimpan', [
          {
            text: 'Ok',
            onPress: () => {
              setKdGaji('');
              setSelectedKaryawan({kdkaryawan: '', nama: ''});
              setSelectedJabatan({kode: '', nama: '', harga:''});
              setShowPicker(false);
              setHarga('');
              setValidationErrors({});
              navigation.navigate('DataGaji', {dataAdded: true});
            },
          },
        ]);
      })
      .catch(error => {
        // Handle failure
        console.log(`Gagal Simpan Data : ${error}`);
      });
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <Input
          value={kdgaji}
          onChangeText={setKdGaji}
          label="Kode Gaji"
          labelStyle={styles.labelInput}
          placeholder="Input Kode Gaji..."
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          errorMessage={validationErrors.kdgaji}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={bulan}
            onValueChange={(itemValue, itemIndex) => setBulan(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Pilih Bulan" value="" />
            <Picker.Item label="Januari" value="Januari" />
            <Picker.Item label="Februari" value="Februari" />
            <Picker.Item label="Maret" value="Maret" />
            <Picker.Item label="April" value="April" />
            <Picker.Item label="Mei" value="Mei" />
            <Picker.Item label="Juni" value="Juni" />
            <Picker.Item label="Juli" value="Juli" />
            <Picker.Item label="Agustus" value="Agustus" />
            <Picker.Item label="September" value="September" />
            <Picker.Item label="Oktober" value="Oktober" />
            <Picker.Item label="November" value="November" />
            <Picker.Item label="Desember" value="Desember" />
          </Picker>
        </View>

        <View style={styles.inputRow}>
          <View style={{flex: 4, marginRight: 10}}>
            <Input
              label="Kode Karyawan"
              labelStyle={styles.labelInput}
              placeholder="Cari Karyawan..."
              disabled={true}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              value={`${selectKaryawan.kdkaryawan} - ${selectKaryawan.nama}`}
              errorMessage={validationErrors.karyawankd}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Cari"
              containerStyle={styles.buttonContainer}
              buttonStyle={{
                height: 50,
                backgroundColor: '#65B741',
                borderRadius: 10,
              }}
              onPress={modalSearchKaryawan}
            />
            <ModalDataKaryawan
              isVisible={modalKaryawanVisible}
              onClose={() => setModalKaryawanVisible(false)}
              onKaryawanSelected={onKaryawanSelected} // Karyawanikan callback ke ModalDataKaryawan
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={{flex: 4, marginRight: 10}}>
            <Input
              label="Kode Jabatan"
              labelStyle={styles.labelInput}
              placeholder="Cari Jabatan..."
              disabled={true}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              value={`${selectedJabatan.kode} - ${selectedJabatan.nama}`}
              errorMessage={validationErrors.jabatankd}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Cari"
              containerStyle={styles.buttonContainer}
              buttonStyle={{
                height: 50,
                backgroundColor: '#492e87',
                borderRadius: 10,
              }}
              onPress={modalSearchJabatan}
            />

            <ModalDataJabatan
              isVisible={modalJabatanVisible}
              onClose={() => setModalJabatanVisible(false)}
              onJabatanSelected={onJabatanSelected} // Karyawanikan callback ke
              ModalDataKaryawan
            />
          </View>
        </View>
        <Input
          value={`${selectedJabatan.gapok}`}
          onChangeText={setHarga}
          label="Gaji Pokok"
          labelStyle={styles.labelInput}
          disabled={true}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />
        <Input
          value={`${selectedJabatan.tunjangan}`}
          onChangeText={setTunjangan}
          label="Tunjangan"
          labelStyle={styles.labelInput}
          disabled={true}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />
        <Input
          value={bonus}
          onChangeText={text => {
            setBonus(text);
            calculateTotal();
          }}
          label="Bonus"
          labelStyle={styles.labelInput}
          placeholder="Input Bonus..."
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          errorMessage={validationErrors.bonus}
        />

        <Input
          value={total}
          onChangeText={setTotal}
          label="Total Gaji"
          labelStyle={styles.labelInput}
          disabled={true}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />

        <Button
          title={loading ? 'Tunggu...' : 'Simpan Data'}
          disabled={loading}
          onPress={submitServis}
          buttonStyle={{marginHorizontal: 10}}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginBottom: 5,
  },
  labelInput: {
    color: '#7071e8',
    borderBottomColor: '#7071e8',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  labelInputHari: {
    color: '#7071e8',
    borderBottomColor: '#7071e8',
    marginBottom: 2,
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 16,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
    elevation: 3,
  },
  inputText: {
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 25,
  },
  pickerContainer: {
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 20,
  },
  picker: {
    color: 'black',
    fontWeight: 'bold',
  },

  dateContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateDisplay: {
    fontSize: 16,
    marginTop: 10,
  },

  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
