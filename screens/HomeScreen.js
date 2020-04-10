import * as React from 'react';
import { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { getLocationAsync } from '../services/LocationService';
import { getWekasAsync } from '../services/WekaService';

export default class HomeScreen extends Component {

  constructor() {
    super();
    this.state = { 
      isLoading: true,
      mapRegion: null,
      wekaData: [] 
    };
  }

  async componentDidMount() {
    const locationResponse = await getLocationAsync();
    const wekaResponse = await getWekasAsync(locationResponse.coords.latitude, locationResponse.coords.longitude);
    const wekaDataJson = await wekaResponse.json();
    
    this.setState({
       wekaData: wekaDataJson, 
       mapRegion: {
         latitude: locationResponse.coords.latitude,
         longitude: locationResponse.coords.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0922
       },
       isLoading: false
      });
  }

  _handleMapRegionChange = mapRegion => {
    console.log('resetting initial region');
    console.log(mapRegion);
    this.state.mapRegion = mapRegion;
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
                  initialRegion={this.state.mapRegion}
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
