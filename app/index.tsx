import { Text,View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRouter } from 'expo-router';
import StyledBtn from '../components/styledBtn.tsx';

function barcodeScanned(scanningResult){
    const router = useRouter();
    router.navigate('/' + scanningResult.data); //foolproof this later
}

export default function ScanQR(){
    const [permission, requestPermission] = useCameraPermissions();

    if(!permission) return <View/>;

    let elements;
    if(!permission.granted){
        elements = <Text style={{fontSize: 30}}>Zezwól na użycie aparatu</Text>;
    }else{
        elements = <>
                <Text style={{fontSize: 50}}>Zeskanuj kod QR</Text>
                <CameraView
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                      }}
                    onBarcodeScanned={barcodeScanned}
                />
            </>;
    }

    return (
            <View
              style={{
                  width: '100%',
                  height: '10%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
              }}
            >
                {elements}
            </View>
        );
}
