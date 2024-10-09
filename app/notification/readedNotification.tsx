import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { allNotifications } from '@/api/notifications/allNotifications';
import NotificationDisplay from '@/components/NotificationDisplay';
import { useFocusEffect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native-gesture-handler';

const readedNotification = () => {
  const { data, refetch} = allNotifications();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh on pull-down
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

  // Refresh when navigating back to the screen
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data && data.length > 0 ? (
          <><View style={styles.Textcontainer}>
            <Text style={styles.boldText}></Text>
          </View><View style={styles.Eventcontainer}>
            {data.map((event) => (
              <NotificationDisplay
                KeyId={event.noId}
                title={event.noMessage}
                status={event.noStatus}
              />
            ))}
          </View></>
        ) : (
          <View></View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default readedNotification;

const styles = StyleSheet.create({
  Eventcontainer: {
    flex: 1,
    alignItems: "center",
    height: "auto",
  },
  Textcontainer: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  boldText: {
    fontSize: 12,
    fontFamily: "MontserratLight",
    fontWeight: "bold",
  },
});
