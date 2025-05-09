import { View } from "react-native";
import StyledBtn from "../components/styledBtn.tsx";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Index() {
  const db = useSQLiteContext();
  const addRowStatement = db.prepareSync(
      "INSERT INTO exitEnterTimes (id, isEntering, time) VALUES ($id, $isEntering, $time)"
      );
  const router = useRouter();

  const { id } = useLocalSearchParams();


  function continueRegistering(isEntering: boolean){
      const data = {
         $id: id,
         $isEntering: isEntering,
         $time: Date.now()
      }
      addRowStatement.executeAsync(data)
        .then(() => {
            router.navigate('/');
        })
        .catch((error) => {
            console.error(error);
        });
  }

  return (
          <View
              style={{
                  width: '100%',
                  height: '30%',
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

