import { useContext } from 'react';
import { OnlineContext } from '../contexts/onlineContext.ts';
import { Text, StyleSheet } from 'react-native';

export default function ConnectionDisplayer(){
    const isOnline = useContext(OnlineContext);
    const styles = StyleSheet.create({
        container: {
            backgroundColor: isOnline ? "#0f0" : "#f00",
            color: "#fff",
            fontSize: 30,
            height: '100%',
            textAlign: 'center',
            textAlignVertical: 'center',
            width: '15%',
        }
    });

    return (
        <Text style={styles.container}>
            {
                isOnline ?
                "Połączono" :
                "Błąd łączenia"
            }
        </Text>
    );
}