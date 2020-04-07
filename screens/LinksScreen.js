import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';

export default function LinksScreen() {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
      fetch('https://4qs08efi8i.execute-api.ap-southeast-2.amazonaws.com/dev/v1/wekas?latitude=-41.304021&longitude=174.799883', {
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
        <MapView
                style={styles.mapStyle}
                showsUserLocation={true}
                provider={MapView.PROVIDER_GOOGLE}
                showsMyLocationButton={true}
                initialRegion={{
                  latitude: -41.304021,
                  longitude: 174.799883,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0922,
                }}
              >
            {
             data.map((marker, id) => ( 
              <MapView.Marker 
                key={id} 
                coordinate={marker.location} 
                title={marker.id}>
                  {/* <Image source={require('../assets/images/running_man.jpg')} style={{ height: 20, width:20 }} /> */}
              </MapView.Marker> ))
            }
        </MapView>
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
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
