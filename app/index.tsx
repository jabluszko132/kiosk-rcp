import { Text, View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef, useContext } from 'react';
import { getItemAsync } from 'expo-secure-store';
import NameTerminalModal from '../components/nameTerminalModal.tsx';
import { useSQLiteContext } from 'expo-sqlite';
import { OnlineContext } from '../contexts/onlineContext.ts';

export default function Index(){
    const router = useRouter();
    const [ modalVisible, setModalVisible ] = useState(false);
    const [userId, setUserId] = useState('');
    const barcodeScanner = useRef(null);
    const db = useSQLiteContext();
    const isOnline = useContext(OnlineContext)

    async function uploadLocalDataIfNeeded(){
        const localData: object[] = await db.getAllAsync('SELECT * FROM exitEnterTimes');
        if(localData.length > 0){
          fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload-data-bulk`,{
              method: "POST",
              headers: {
                  'Content-type': 'application/json',
              },
              body: JSON.stringify(
                  localData.map(row => {
                          row.isEntering = row.isEntering === 1 ? true : false;
                          row.time = parseInt(row.time);
                          return row;
                      })
                  ),
          })
          .then(async (res) => {
              if(res.ok){
                  db.runAsync('DELETE FROM exitEnterTimes')
                      .catch(error => console.error(error));
              }else{
                  console.error(await res.text());
              }
          })
          .catch(error => console.error(error));
        }
    }


    useEffect(() => {
        async function checkTerminalId(){
            const terminalId = await getItemAsync('terminalId') ?? '';
            if(terminalId === ''){
                setModalVisible(true);
            }
        };
        checkTerminalId();
    });

  useEffect(() => {
    if(isOnline){
        uploadLocalDataIfNeeded();
    }
  },[isOnline]);

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        label: {
            fontSize: 125,
            paddingBottom: 30,
        },
        input: {
            opacity: 0,
            height: 0,
        }
    });

    const nameTerminalModal = (
            <NameTerminalModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Zeskanuj kod QR</Text>
            <TextInput
                ref={barcodeScanner}
                style={styles.input}
                autoFocus
                showSoftInputOnFocus={false}
                value={userId}
                onChangeText={setUserId}
                onFocus={()=>Keyboard.dismiss()}
                onBlur={()=>barcodeScanner.current.focus()}
                onSubmitEditing={() => {router.navigate(`/${userId}`)}}
            />
            {modalVisible && nameTerminalModal}
        </View>
    );
}
