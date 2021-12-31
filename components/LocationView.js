import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import MapView from 'react-native-maps'

export const LocationView = ({location}) => {
    return (
        <MapView 
            style={styles.container}
            region={{
                latitude: location.latitude,
                longitude: location.longitude
            }}
            anotations={[
                {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            ]}
            scrollEnabled={false}
            zoomEnabled={true}
        />
    )
}

const styles = StyleSheet.create({
    container:  {
        height: 180, 
        width: 200,
    }

})
