import * as React from 'react';
import { Component } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View, Text, AppState, Switch } from 'react-native';
import MapView from 'react-native-maps';
import { getLocationAsync, askLocationPermissionAsync } from '../services/LocationService';
import { getWekasAsync, sendWekaDataAsync, deleteWekaDataAsync } from '../services/WekaService';
import { getDeviceUniqueId } from '../services/DeviceService';

export default class HomeScreen extends Component {
  _isMounted = false;

  state = {
    appState: AppState.currentState,
    deviceId: null,
    error: null,
    hasError: false,
    isLoading: true,
    intervalId: null,
    mapRegion: null,
    shareLocation: false,
    wekaData: []
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  async updateStateWithWekaData() {

    // get only when phone is unlocked
    // post should be sent all the time in the background

    const locationResponse = await getLocationAsync();

    const currentLatitude = locationResponse.coords.latitude;
    const currentLongitude = locationResponse.coords.longitude;
    const currentLatitudeDelta = 0.0922;
    const currentLongitudeDelta = 0.0922;
    const deviceId = getDeviceUniqueId();

    await sendWekaDataAsync(deviceId, currentLatitude, currentLongitude);
    // hook to mapview.animateToRegion to keep tracking user location in center

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

  deleteWekaDataAndUpdateState = () => {
    deleteWekaDataAsync(this.state.deviceId || getDeviceUniqueId());

    if (this._isMounted) {
      this.setState({ wekaData: [] });
    }
  }

  async componentDidMount() {
    try {
      this._isMounted = true;
      AppState.addEventListener('change', this.handleAppStateChange);

    } catch (error) {
      if (this._isMounted) {
        this.setState({ error: error, hasError: true })
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
    if (nextAppState === 'active') {      
      if (this.state.shareLocation) {
        this.updateStateWithWekaData();
      }

      if (this._isMounted) {
        this.setState({ appState: nextAppState });
      }
    } else if (nextAppState === 'background') {
      this.deleteWekaDataAndUpdateState();

      // TODO: if location sharing is on, post location in the background instead
    }
  };

  handleMapRegionChange = async mapRegion => {
    console.log('Region has changed');

    if (!this.state.shareLocation){
      return;
    }

    const wekaResponse = await getWekasAsync(
      mapRegion.latitude, 
      mapRegion.longitude, 
      mapRegion.latitudeDelta, 
      mapRegion.longitudeDelta);

    const wekaDataJson = await wekaResponse.json();

    if (this._isMounted) {
      this.setState({ wekaData: wekaDataJson, mapRegion: mapRegion });
    }
  };

  handleLocationShareChange = async isLocationSharingActive => {
    if (!isLocationSharingActive) {
      this.deleteWekaDataAndUpdateState();

    } else {
      await askLocationPermissionAsync();
      this.updateStateWithWekaData();

      // const intervalId = setInterval(async () => {
      //   if (this.state.shareLocation){
      //     this.updateStateWithWekaData();
      //   }
      // }, 30000);   

      // if (this._isMounted) {
      //   this.setState({ intervalId: intervalId, shareLocation: true });
      // }
    }

    if (this._isMounted) {
      this.setState({ shareLocation: isLocationSharingActive });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Text style={styles.errorText}>Oops. Something went wrong.</Text>
      );
    }

    return (
      <View style={styles.container}>

        <View style={styles.locationSharing}>
          <Text style={styles.locationSharingLabel}>Location sharing: </Text>
          <Switch
            value={this.state.shareLocation}
            onValueChange={this.handleLocationShareChange}
          />
        </View>

        {this.state.isLoading ? <ActivityIndicator /> : (
          <MapView
            style={styles.mapStyle}
            showsUserLocation={true}
            showsMyLocationButton={true}
            provider={MapView.PROVIDER_GOOGLE}
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
    backgroundColor: '#fafafa'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  errorText: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red'
  },
  locationSharing: {
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationSharingLabel: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
