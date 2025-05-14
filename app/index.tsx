import { Text, View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import StyledBtn from '../components/styledBtn.tsx';
import { TerminalIdContext } from '../contexts/terminalIdContext.ts';
import { useEffect, useState, useRef } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
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

    const barcodeScanner = useRef(null);

    const [userId, setUserId] = useState('');

    let elements;
    elements = <>
            <Text style={{fontSize: 50}}>Zeskanuj kod QR</Text>
            <TextInput
                style={{
                    opacity: 0,
                    height: 0,
                }}
                showSoftInputOnFocus={false}
                ref={barcodeScanner}
                value={userId}
                onChangeText={setUserId}
                onSubmitEditing={() => {router.navigate(`/${userId}`)}}
                onBlur={()=>barcodeScanner.current.focus()}
                autoFocus
            />
        </>;

    return (
            <View
              style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
              }}
            >
            <NameTerminalModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                afterSubmit={() => {barcodeScanner.current.focus()}}
            />
                {elements}
            </View>
        );
}
