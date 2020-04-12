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
    hasError: false,
    intervalId: null
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  async updateStateWithWekaData() {

    const locationResponse = await getLocationAsync();
    const currentLatitude = locationResponse.coords.latitude;
    const currentLongitude = locationResponse.coords.longitude;
    const deviceId = Constants.deviceId;

    await sendWekaDataAsync(deviceId, currentLatitude, currentLongitude);
    const wekaResponse = await getWekasAsync(currentLatitude, currentLongitude);
    const wekaDataJson = await wekaResponse.json();

    if (this._isMounted) {
      this.setState({
        wekaData: wekaDataJson,
        mapRegion: {
          latitude: currentLatitude,
          longitude: currentLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922
        },
        isLoading: false
      });
    }
  }

  async componentDidMount() {
    try {
      this._isMounted = true;

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
  }

  handleMapRegionChange = mapRegion => {
    if (this._isMounted) {
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
