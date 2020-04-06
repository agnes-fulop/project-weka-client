import * as React from 'react';
import MapView from 'react-native-maps';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

var state = {
  markers: [{
    key: 1,
    title: 'home',
    coordinates: {
      latitude: -41.304021,
      longitude: 174.799883
    },
  },
  {
    key: 2,
    title: 'not_home',
    coordinates: {
      latitude: -41.305488,
      longitude: 174.800645
    },  
  }]
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <MapView
                style={styles.mapStyle}
                showsUserLocation={true}
                provider={MapView.PROVIDER_GOOGLE}
                showsMyLocationButton={true}
                initialRegion={{
                  latitude: -41.304021,
                  longitude: 174.799883,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0922,
                }}
              >
            {
             state.markers.map((marker, index) => ( 
              <MapView.Marker 
                key={index} 
                coordinate={marker.coordinates} 
                title={marker.title}>
                  <Image source={require('../assets/images/running_man.jpg')} style={{ height: 20, width:20 }} />
              </MapView.Marker> ))
            }
        </MapView>
      </ScrollView>

    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
