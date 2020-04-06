import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function LinksScreen() {


  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
      fetch('https://4qs08efi8i.execute-api.ap-southeast-2.amazonaws.com/dev/v1/wekas?latitude=56&longitude=23423', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': '7pJgfpkrUb6gsOwAfSJFLG0OFU1OpCt7l7fYVMMg'
        }
      })
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        console.log(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
 
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>Id:{item.id}, Latitude: {item.location.latitude} - longitude: {item.location.longitude}</Text>
          )}
      />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
