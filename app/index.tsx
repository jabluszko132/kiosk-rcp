import { Text, View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StyledBtn from '../components/styledBtn.tsx';
import { useEffect, useState, useRef } from 'react';
import { getItemAsync } from 'expo-secure-store';
import NameTerminalModal from '../components/nameTerminalModal.tsx';


function barcodeScanned(scanningResult){
    const router = useRouter();
    router.navigate('/' + scanningResult.data); //foolproof this later
}

export default function Index(){
    const router = useRouter();
    const [ modalVisible, setModalVisible ] = useState(false);
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
        Keyboard.dismiss();
    },[modalVisible]);

    const barcodeScanner = useRef(null);

    const [userId, setUserId] = useState('');

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
                onBlur={()=>barcodeScanner.current.focus()}
                onSubmitEditing={() => {router.navigate(`/${userId}`)}}
            />
            <NameTerminalModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                afterSubmit={() => {barcodeScanner.current.focus()}}
            />
        </View>
    );
}
