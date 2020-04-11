let wekaData = [];

export async function getWekasAsync(latitude, longitude) {
    console.log('Getting weka data');
    console.log(this.wekaData);
    
    return await Promise.resolve({
        json: () => this.wekaData
    });
  };

  export async function sendWekaDataAsync(deviceId, lat, long) {
    console.log('Posting my current location');

    let weka = {
        id: deviceId,
        location: {
            latitude: lat,
            longitude: long
        }
    };

    wekaData.push(weka);
  
    return await Promise.resolve({
        json: () => weka
    });
  };