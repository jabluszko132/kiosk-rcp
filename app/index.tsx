import { Text, View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { getItemAsync } from 'expo-secure-store';
import NameTerminalModal from '../components/nameTerminalModal.tsx';

export default function Index(){
    const router = useRouter();
    const [ modalVisible, setModalVisible ] = useState(false);
    const [userId, setUserId] = useState('');
    const barcodeScanner = useRef(null);

    useEffect(() => {
        async function checkTerminalId(){
            const terminalId = await getItemAsync('terminalId') ?? '';
            if(terminalId === ''){
                setModalVisible(true);
            }
        };
        checkTerminalId();
    });

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
