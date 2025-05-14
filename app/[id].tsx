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

  async function uploadLocalDataIfNeeded(){
      const localData: Object[] = await db.getAllAsync('SELECT * FROM exitEnterTimes');
      if(localData.length > 0){
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload-data-bulk`,{
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(
                        localData.map(row => {
                                row.isEntering = row.isEntering === 1 ? true : false;
                                row.time = parseInt(row.time);
                                return row;
                            })
                        ),
        })
        .then(async (res) => {
            if(res.ok){
                db.runAsync('DELETE FROM exitEnterTimes')
                    .catch(error => console.error(error));
            }else{
                console.error(await res.text());
            }
        })
        .catch(error => console.error(error));
      }
  }

  useEffect(() => {
    if(isOnline){
        uploadLocalDataIfNeeded();
    }
  },[isOnline]);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  function storeInLocalDb(isEntering: boolean, time: String){
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
                  height: '45%',
                  justifyContent: 'space-around',
                  alignItems: 'center',
              }}
          >
            <StyledBtn
                title="WEJŚCIE"
                onPress={() => {
                    continueRegistering(true);
                    }}
            />
            <StyledBtn
                title="WYJŚCIE"
                onPress={() => {
                    continueRegistering(false);
                    }}
            />
            <StyledBtn
                title="ANULUJ"
                isSecondary
                onPress={() => router.navigate('/')}
            />
          </View>
  );
}

