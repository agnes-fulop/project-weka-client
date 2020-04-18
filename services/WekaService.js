import { getEnvVariables } from "../constants/Environment";

const envData = getEnvVariables();

export async function getWekasAsync(latitude, longitude, latitudeDelta, longitudeDelta) {
    console.log('Getting weka data from API');
  
    return await fetch(`${envData.apiUrl}?latitude=${latitude}&longitude=${longitude}&latitudeDelta=${latitudeDelta}&longitudeDelta=${longitudeDelta}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-api-key': envData.apiKey
      }
    });
  };

export async function sendWekaDataAsync(deviceId, latitude, longitude) {
    console.log('Posting my current location for id: ' + deviceId);
  
    return await fetch(envData.apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': envData.apiKey
      },
      body: JSON.stringify({
        id: deviceId,
        location: {
            latitude: latitude,
            longitude: longitude
        }
      })
    });
  };

export async function deleteWekaDataAsync(id) {
    console.log(`Deleting weka data for Id: ${id}`);
  
    return await fetch(`${envData.apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'x-api-key': envData.apiKey
      }
    });
  };
  