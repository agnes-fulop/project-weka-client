import * as React from 'react';
import { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View, Text, AppState } from 'react-native';
import MapView from 'react-native-maps';
import { getLocationAsync, askLocationPermissionAsync } from '../services/LocationService';
import { getWekasAsync, sendWekaDataAsync, deleteWekaDataAsync } from '../services/WekaService';
import { getDeviceUniqueId } from '../services/DeviceService';

export default class HomeScreen extends Component {
  _isMounted = false;

  state = {
    appState: AppState.currentState,
    deviceId: null,
    isLoading: true,
    mapRegion: null,
    wekaData: [],
    error: null,
    hasError: false,
    intervalId: null
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // TODO: delete if deliberate location sharing is on

  async updateStateWithWekaData() {

    // get only when phone is unlocked
    // post should be sent all the time in the background

    const locationResponse = await getLocationAsync();
    const currentLatitude = locationResponse.coords.latitude;
    const currentLongitude = locationResponse.coords.longitude;
    const currentLatitudeDelta = 0.0922;
    const currentLongitudeDelta = 0.0922;
    const deviceId = getDeviceUniqueId();

    console.log('current location');
    console.log(locationResponse);

    await sendWekaDataAsync(deviceId, currentLatitude, currentLongitude);

    const wekaResponse = await getWekasAsync(
      currentLatitude, 
      currentLongitude, 
      currentLatitudeDelta,
      currentLongitudeDelta);

    const wekaDataJson = await wekaResponse.json();

    if (this._isMounted) {
      this.setState({
        wekaData: wekaDataJson,
        mapRegion: {
          latitude: currentLatitude,
          longitude: currentLongitude,
          latitudeDelta: currentLatitudeDelta,
          longitudeDelta: currentLongitudeDelta
        },
        deviceId: deviceId,
        isLoading: false
      });
    }
  }

  async componentDidMount() {
    try {
      this._isMounted = true;

      AppState.addEventListener('change', this.handleAppStateChange);

      await askLocationPermissionAsync();

      this.updateStateWithWekaData();

      const intervalId = setInterval(async () => {
        this.updateStateWithWekaData();
      }, 30000);   

      this.setState({ intervalId: intervalId });

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
    clearInterval(this.state.intervalId);
    AppState.removeEventListener('change', this.handleAppStateChange);

    deleteWekaDataAsync(this.state.deviceId);
  }

  handleAppStateChange = async nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
    }

    const wekaResponse = await getWekasAsync(
      this.state.mapRegion.latitude, 
      this.state.mapRegion.longitude,
      this.state.mapRegion.latitudeDelta,
      this.state.mapRegion.longitudeDelta);

    const wekaDataJson = await wekaResponse.json();

    if (this._isMounted) {
      this.setState({
        wekaData: wekaDataJson,
        appState: nextAppState
      });
    }
  };

  handleMapRegionChange = async mapRegion => {
    if (this._isMounted) {
      console.log('Region has changed');

      const wekaResponse = await getWekasAsync(mapRegion.latitude, mapRegion.longitude, mapRegion.latitudeDelta, mapRegion.longitudeDelta);
      const wekaDataJson = await wekaResponse.json();

      console.log('updated data for new location');
      console.log(wekaDataJson);
      console.log(mapRegion);
  
      this.setState({
        wekaData: wekaDataJson,
        mapRegion: mapRegion
      });
      
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
        {this.state.isLoading ? <ActivityIndicator /> : (
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
                  {/* TODO: generate random names for markers */}
                </MapView.Marker>))
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
