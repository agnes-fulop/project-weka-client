export async function getWekasAsync(latitude, longitude) {
    console.log('Calling API');
  
    // return await fetch('https://4qs08efi8i.execute-api.ap-southeast-2.amazonaws.com/dev/v1/wekas?latitude=' 
    //   + latitude
    //   + '&longitude='
    //   + longitude, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'x-api-key': '7pJgfpkrUb6gsOwAfSJFLG0OFU1OpCt7l7fYVMMg'
    //   }
    // });

    return await Promise.resolve({
        json: () =>
          [
            {
                id: '1abc',
                location: {
                    latitude: -41.304021,
                    longitude: 174.799883
                },
            },
            {
                id: '2abc',
                location: {
                    latitude: -41.305488,
                    longitude: 174.800645
                }
            }
          ]
    });
  };