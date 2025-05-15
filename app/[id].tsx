import { View } from "react-native";
import StyledBtn from "../components/styledBtn.tsx";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter, useLocalSearchParams } from "expo-router";
import { OnlineContext } from '../contexts/onlineContext.ts';
import { useContext, useEffect } from 'react';

export default function Index() {
  const isOnline = useContext(OnlineContext);
  const db = useSQLiteContext();
  const addRowStatement = db.prepareSync(
      "INSERT INTO exitEnterTimes (id, isEntering, time) VALUES ($id, $isEntering, $time)"
      );
  const router = useRouter();
  const { id } = useLocalSearchParams();

  function storeInLocalDb(isEntering: boolean, time: string){
      const data = {
               $id: id,
               $isEntering: isEntering,
               $time: time
      }
      addRowStatement.executeAsync(data)
        .then(() => {
            router.navigate('/');
        })
        .catch((error) => {
            console.error(error);
        });
  }

  function continueRegistering(isEntering: boolean){
      if(isOnline){
        const time = Date.now();
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload-data`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                 id: id,
                 isEntering: isEntering,
                 time: time,
             }),
        })
        .then(async (res) => {
            if(res.ok){
                router.navigate('/')
            }else{
                console.error(await res.text());
                storeInLocalDb(isEntering,time);
            }
        })
        .catch((error) => {
            console.error(error);
            storeInLocalDb(isEntering,time);
        });
      }else{
        storeInLocalDb(isEntering, Date.now());
      }
  }

  return (
          <View
              style={{
                  width: '100%',
                  height: '75%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
              }}
          >
            <StyledBtn
                title="WEJŚCIE"
                onPress={() => continueRegistering(true)}
            />
            <StyledBtn
                title="WYJŚCIE"
                onPress={() => continueRegistering(false)}
            />
            <StyledBtn
                title="ANULUJ"
                isSecondary
                onPress={() => router.navigate('/')}
            />
          </View>
  );
}

