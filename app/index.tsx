import { Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'
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


    const [permission, requestPermission] = useCameraPermissions();

    if(!permission) return <View/>;

    let elements;
    if(!permission.granted){
        elements = <Text style={{fontSize: 30}}>Zezwól na użycie aparatu</Text>;
    }else{
        elements = <>
                <Text style={{fontSize: 50}}>Zeskanuj kod QR</Text>
                <CameraView
                    style={{width: "50%", height: "300"}}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                      }}
                    onBarcodeScanned={barcodeScanned}
                />
                <StyledBtn
                    title={"debug reset name"}
                    onPress={() => {
                            setItemAsync('terminalId','');
                        }}
                />
            </>;
    }

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
