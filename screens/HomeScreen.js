import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as React from 'react';
import { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';

export async function getWekasAsync(latitude, longitude) {
  console.log('Calling API');

  return await fetch('https://4qs08efi8i.execute-api.ap-southeast-2.amazonaws.com/dev/v1/wekas?latitude=' 
    + latitude
    + '&longitude='
    + longitude, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': '7pJgfpkrUb6gsOwAfSJFLG0OFU1OpCt7l7fYVMMg'
    }
  });
};

export async function getLocationAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      errorMessage: 'Permission to access location was denied',
    });
  }

  return await Location.getCurrentPositionAsync({});
};

export default class HomeScreen extends Component {

  constructor() {
    super();
    this.state = { 
      isLoading: true,
      initialRegion: null,
      wekaData: [] 
    };
  }

  async componentDidMount() {
    const locationResponse = await getLocationAsync();
    const wekaResponse = await getWekasAsync(locationResponse.coords.latitude, locationResponse.coords.longitude);
    const wekaJson = await wekaResponse.json();
    
    this.setState({
       wekaData: wekaJson, 
       initialRegion: {
         latitude: locationResponse.coords.latitude,
         longitude: locationResponse.coords.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0922
       },
       isLoading: false
      });
    console.log(this.state);
  }

  _handleMapRegionChange = initialRegion => {
    console.log('resetting initial region');
    console.log(initialRegion);
    this.state.initialRegion = initialRegion;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? <ActivityIndicator/> : (
          <MapView
                  style={styles.mapStyle}
                  showsUserLocation={true}
                  provider={MapView.PROVIDER_GOOGLE}
                  showsMyLocationButton={true}
                  initialRegion={this.state.initialRegion}
                  onRegionChangeComplete={this._handleMapRegionChange}
                >
              {
              this.state.wekaData.map((marker, id) => ( 
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
