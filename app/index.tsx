import { Text,View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRouter } from 'expo-router';

function barcodeScanned(scanningResult){
    const router = useRouter();
    router.navigate()
}

export default function ScanQR(){
    const [permission, requestPermission] = useCameraPermissions();

    if(!permission) return <View/>;

    if(!permission.granted){
        const elements = <Text>Zezwól na użycie aparatu</Text>;
    }else{
        const elements = (
            <Text>Zeskanuj kod QR</Text>
            <CameraView
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                onBarcodeScanned={barcodeScanned}
            />
            );
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
