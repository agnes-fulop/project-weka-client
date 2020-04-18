import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export async function getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    // check if this gets executed always or is cached
    
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }
  
    return await Location.getCurrentPositionAsync({});
};
  