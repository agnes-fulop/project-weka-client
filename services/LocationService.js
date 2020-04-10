import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export async function getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
  
    return await Location.getCurrentPositionAsync({});
  };
  