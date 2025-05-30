import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SQLiteProvider, SQLiteDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { TerminalContext } from '../contexts/terminalContext.ts';
import { OnlineContext } from '../contexts/onlineContext.ts';
import { getItemAsync } from 'expo-secure-store';
import ConnectionDisplayer from '../components/connectionDisplayer.tsx';

//moving initDB to a different file causes a compilation error
async function initDB(db: SQLiteDatabase) {
    try{
        await db.execAsync(
            "CREATE TABLE IF NOT EXISTS exitEnterTimes(id TEXT NOT NULL, isEntering INTEGER NOT NULL, time TEXT NOT NULL);"
        );
    }catch(error){
        console.error(error);
    }
}

export default function RootLayout() {
    const [terminalId, setTerminalId] = useState('');
    const [isOnline, setIsOnline] = useState(undefined);

    useEffect(() => {
        async function readTerminalId(){
            const localTerminalId = await getItemAsync('terminalId');
            if(localTerminalId !== terminalId){
                setTerminalId(localTerminalId);
            }
        }
        readTerminalId();
    });

    useEffect(() => {
        function checkConnection(){
            fetch(`${process.env.EXPO_PUBLIC_API_URL}/online-check/${terminalId}`)
                .then((res) => {
                    if(res.ok){
                        if(isOnline !== true) setIsOnline(true);
                    }else {
                        if(isOnline !== false) {
                            setIsOnline(false);
                        }
                    }
                })
                .catch((error) => {
                    if(isOnline !== false) {
                        setIsOnline(false);
                    }
                });
        };
        let connectionCheckerInterval = null;
        if(terminalId === ''){
            clearInterval(connectionCheckerInterval);
        }else if(connectionCheckerInterval == null){
            checkConnection();
            connectionCheckerInterval = setInterval(checkConnection, 10000);
        }
        return () => {
            clearInterval(connectionCheckerInterval);
        }
    },[isOnline,terminalId]);

    const styles = StyleSheet.create({
        header: {
            width: '100%',
            height: 50,
        },
        terminalIdDisplay: {
            fontSize: 40,
            height: '100%',
            textAlign: 'center',
            textAlignVertical: 'center',
            paddingLeft: 30,
        },
        routeContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }
    });

    return (
    <OnlineContext value={isOnline}>
        <TerminalContext value={{terminalId, setTerminalId}}>
          <View style={styles.header}>
            <ConnectionDisplayer/>
          </View>
          <SQLiteProvider databaseName="rcpData.db" onInit={initDB}>
              <View style={styles.routeContainer} >
                <Slot/>
              </View>
          </SQLiteProvider>
      </TerminalContext>
  </OnlineContext>);
}
