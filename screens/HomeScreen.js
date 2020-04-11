import * as React from 'react';
import { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import { getLocationAsync } from '../services/LocationService';
import { getWekasAsync, sendWekaDataAsync } from '../services/WekaService';
import Constants from 'expo-constants';

export default class HomeScreen extends Component {
  _isMounted = false;

  state = { 
    isLoading: true,
    mapRegion: null,
    wekaData: [{}],
    error: null,
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  async componentDidMount() {
    this._isMounted = true;

    try {
      const locationResponse = await getLocationAsync();
      
      setInterval(async () => {
        await sendWekaDataAsync(Constants.deviceId, locationResponse.coords.latitude, locationResponse.coords.longitude);
      }, 30000);

      const wekaResponse = await getWekasAsync(locationResponse.coords.latitude, locationResponse.coords.longitude);
      const wekaDataJson = await wekaResponse.json();

      console.log(wekaDataJson);
      
      if (this._isMounted) {

        console.log(wekaDataJson);
        this.setState({
          wekaData: wekaDataJson, 
          mapRegion: {
            latitude: locationResponse.coords.latitude,
            longitude: locationResponse.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0922
          },
          isLoading: false,
          error: null
        });
      }

      setInterval(async () => {
        const wekaResponse = await getWekasAsync(locationResponse.coords.latitude, locationResponse.coords.longitude);
        const wekaDataJson = await wekaResponse.json();
        
        if (this._isMounted) {
          this.setState({
            wekaData: wekaDataJson, 
            mapRegion: {
              latitude: locationResponse.coords.latitude,
              longitude: locationResponse.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0922
            },
            isLoading: false,
            error: null
          });
        }
      }, 30000);

    } catch (error) {
      if (this._isMounted) {
        this.setState({
          error: error,
          hasError: true
        })
      }
      console.log(this.state.error);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleMapRegionChange = mapRegion => {
    if (this._isMounted){
      this.state.mapRegion = mapRegion;
    }
  };

  render() {
    if (this.state.hasError) {
      return (
         <Text style={styles.errorText}>Oops. Something went wrong.</Text>
      );
    }

    return (
        <View style={styles.container}>
          { this.state.isLoading ? <ActivityIndicator/> : (
            <MapView
                    style={styles.mapStyle}
                    showsUserLocation={true}
                    provider={MapView.PROVIDER_GOOGLE}
                    showsMyLocationButton={true}
                    initialRegion={this.state.mapRegion}
                    onRegionChangeComplete={this.handleMapRegionChange}
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
  errorText: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red'
  }
});
