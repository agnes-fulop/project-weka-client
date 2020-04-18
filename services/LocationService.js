import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export async function getLocationAsync() {
    return await Location.getCurrentPositionAsync({});
};

export async function askLocationPermissionAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }
};
  