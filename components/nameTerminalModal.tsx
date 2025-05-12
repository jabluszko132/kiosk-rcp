import { Modal, TextInput, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import StyledBtn from './styledBtn.tsx';
import { setItemAsync,getItemAsync } from 'expo-secure-store';


interface NameTerminalModalProps {
        modalVisible: boolean,
        setModalVisible: Function
}

export default function NameTerminalModal({modalVisible, setModalVisible}: NameTerminalModalProps){
    function onSubmit(){
        setItemAsync('terminalId',terminalId);
        setModalVisible(false);
    }
    const [ terminalId, setTerminalId ] = useState('');
    const styles = StyleSheet.create({
        container: {
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  left: 0,
                  top: 0,
        },
        title: {
            fontSize: 30,
            padding: 50,
            textAlign: 'center',
        },
        label: {
            fontSize: 20,
            marginTop: 10,
            padding: 30,
            textAlign: 'center',
        },
        input: {
            alignSelf: 'center',
            borderWidth: 1,
            color: "#000",
            fontSize: 40,
            height: 80,
            width: '80%',
            marginBottom: 30,
            paddingBottom: 10,
            paddingTop: 10,
        }
    });

    return <Modal
        transparent={false}
        style={styles.container}
        visible={modalVisible}
    >
        <Text style={styles.title}>Zarejestruj terminal w systemie</Text>
        <Text style={styles.label}>Nazwa terminala:</Text>
        <TextInput
            value={terminalId}
            onChangeText={setTerminalId}
            style={styles.input}
        />
        <StyledBtn
            title={"POTWIERDŹ"}
            onPress={onSubmit}
        />
    </Modal>;
}