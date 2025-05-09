import { Slot } from "expo-router";
import { View } from "react-native";
import { SQLiteProvider, SQLiteDatabase } from 'expo-sqlite';

//moving initDB to a different file causes a compilation error
async function initDB(db: SQLiteDatabase) {
    try{
        await db.execAsync(
            "CREATE TABLE IF NOT EXISTS exitEnterTimes(id INTEGER NOT NULL, isEntering INTEGER NOT NULL, time TEXT NOT NULL);"
        );
    }catch(error){
        console.error(error);
    }
}

export default function RootLayout() {
    return (
    <>
      <View
        style={{width: '100%', height: '50'}}
      >

      </View>
      <SQLiteProvider databaseName="rcpData.db" onInit={initDB}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
                      <Slot/>
          </View>
      </SQLiteProvider>
  </>);
}
