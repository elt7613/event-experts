import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants";
import AddButton from "@/components/AddButton";
import { useNavigation, useRouter } from "expo-router";
import { getEvents } from "@/api/Events/getEvents";
import UpcomingEvent from "@/components/UpcomingEvent";
import PastEvent from "@/components/PastEvent";
import { Feather } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";

const eventdetail = () => {
  const { data } = getEvents();
  const router = useRouter();
  const navigation = useNavigation();

  const openDetailForm = () => {
    router.push("/addDetail");
  };
  const handleBackPress = () => {
   router.push('/drawer');
  };
  // Current date
  const currentDate = new Date();

  // Function to check if the event date is in the past or upcoming
  const isPastEvent = (eventDate: any) => {
    const eventDateTime = new Date(parseInt(eventDate)); // Convert the event date
    return eventDateTime < currentDate; // Compare with current date
  };

  return (
    <>
      <View style={styles.DrawerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.DrawerText}>Event Details</Text>
      </View>
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
      <ScrollView>
        {data && data.length > 0 ? (
          <>
            {/* Upcoming Events */}
            <View style={styles.Textcontainer}>
              <Text style={styles.boldText}>Upcoming Events</Text>
            </View>
            <View style={styles.Eventcontainer}>
              {data
                .filter((event) => !isPastEvent(event.eventDate)) // Filter upcoming events
                .map((event) => (
                  <UpcomingEvent
                    KeyId={event.eventId}
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
  DrawerContainer: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Vertically center items
    padding: 10,
    marginTop: 20,
    borderBottomWidth: 0.5,
  },
  DrawerText: {
    fontSize: 24,
    marginLeft: 20, // Add some spacing between the arrow and the text
  },
});
