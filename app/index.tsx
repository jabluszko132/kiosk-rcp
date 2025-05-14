import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import StyledBtn from '../components/styledBtn.tsx';
import { TerminalIdContext } from '../contexts/terminalIdContext.ts';
import { useEffect, useState } from 'react';
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

    let elements;
    elements = <>
            <Text style={{fontSize: 50}}>Zeskanuj kod QR</Text>
            <StyledBtn
                title={"debug reset name"}
                onPress={() => {
                        setItemAsync('terminalId','');
                    }}
            />
            <StyledBtn
                title={"debug skip scan"}
                onPress={() => {
                        const router = useRouter();
                        router.navigate('/1234xd');
                    }}
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
            />
                {elements}
            </View>
        );
}
