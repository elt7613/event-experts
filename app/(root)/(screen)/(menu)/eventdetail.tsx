import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import { images } from "@/constants";
import AddButton from "@/components/AddButton";
import { useFocusEffect, useRouter } from "expo-router";
import { getEvents } from "@/api/Events/getEvents";
import UpcomingEvent from "@/components/UpcomingEvent";
import PastEvent from "@/components/PastEvent";

const eventdetail = () => {
  const { data, refetch } = getEvents();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const openDetailForm = () => {
    router.push("/addDetail");
  };

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

  // Current date
  const currentDate = new Date();

  // Function to check if the event date is in the past or upcoming
  const isPastEvent = (eventDate: any) => {
    const eventDateTime = new Date(parseInt(eventDate)); // Convert the event date
    return eventDateTime < currentDate; // Compare with current date
  };

  return (
    <>
      {data && data.length > 0 ? (
        <>
          <View style={styles.heading}>
            <Text style={styles.headingText}>All events</Text>
            <TouchableOpacity onPress={openDetailForm}>
              <View style={styles.square}>
                <Text style={styles.plus}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text></Text>
      )}

      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        {data && data.length > 0 ? (
          <>
            {/* Upcoming Events */}
            <View style={styles.Textcontainer}>
              <Text style={styles.boldText}>Upcoming Events</Text>
            </View>
            <View style={styles.Eventcontainer}>
              {data
                .filter((event) => !isPastEvent(event.eventDate)) 
                .map((event) => (

                  <UpcomingEvent
                    KeyId={event.eventId} // ---> in this id dont have any items then display a button in front of the ui
                    title={event.eventName}
                    address={event.eventVenue}
                    date={event.eventDate}
                    item = {event.eventItemsList}
                  />
                ))}
            </View>

            {/* Past Events */}
            <View style={styles.Textcontainer}>
              <Text style={styles.boldText}>Past Events</Text>
            </View>
            <View style={styles.Eventcontainer}>
              {data
                .filter((event) => isPastEvent(event.eventDate)) // Filter past events
                .map((event) => (
                  <PastEvent
                    KeyId={event.eventId}
                    title={event.eventName}
                    address={event.eventVenue}
                    date={event.eventDate}
                  />
                ))}
            </View>
          </>
        ) : (
          <View style={styles.container}>
            <Image source={images.boxGif} style={styles.gif} />
            <AddButton onPress={"/addDetail"} label="Add Events" />
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default eventdetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  gif: {
    width: 200,
    height: 200,
  },
  heading: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginTop: 4,
    borderBottomWidth: 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headingText: {
    fontSize: 16,
    fontFamily: "MontserratLight",
    fontWeight: "bold",
  },
  square: {
    width: 28,
    height: 28,
    backgroundColor: "#fef100",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c5ba00",
    marginRight: 5,
  },
  plus: {
    fontSize: 16,
    color: "#000",
  },
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
