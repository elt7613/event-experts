
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventField from "@/components/EventField";
import ActionButton from "@/components/ActionButton";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useAddEvent } from "@/api/Events/addEvent";

const addDetail = () => {
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [customerDetails, setCustomerDetails] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [previewItems, setPreviewItems] = useState<string[]>([]);

  
  const { mutate: addEvent } = useAddEvent();
  


  useEffect(() => {
    const checkIfFieldsAreFilled = () => {
      return (
        name.trim() !== "" &&
        venue.trim() !== "" &&
        customerDetails.trim() !== "" &&
        eventDate !== undefined &&
        paymentDate !== undefined
      );
    };

    setIsAddButtonEnabled(checkIfFieldsAreFilled());
  }, [name, venue, customerDetails, eventDate, paymentDate]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      const itemNames = selectedItems.map(
        (item, index) => `${index + 1}. ${item.name}`
      );
      setPreviewItems(itemNames);
    } else {
      setPreviewItems([]);
    }
  }, [selectedItems]);

  const router = useRouter();

  const handleBackPress = () => {
    router.push("/(root)/(screen)/(menu)/eventdetail");
  };

  const createEvent = async () => { 
    try {
      addEvent({ 
        eventId:Number(),
        eventName: name,
        eventDate: eventDate?.toISOString() || "",
        eventDatetime: "",
        paymentDate: paymentDate?.toISOString() || "",
        customerDetails: customerDetails,
        eventItemsList: [],
        eventVenue: venue,
        eventStatus: "ONGOING"
      });
      router.push("/(root)/(screen)/(menu)/eventdetail");
    } catch (error) {
      // console.error("Error adding event:", error); 
    }
  };

  return (
    <>
      <View style={styles.DrawerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.DrawerText}>Add Event</Text>
      </View>

      <SafeAreaView style={styles.container}>
        <View style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.form}>
              <EventField
                title="Name"
                value={name}
                placeholder="Enter your name"
                handleChangeText={setName}
              />
              <EventField
                title="Venue"
                value={venue}
                placeholder="Enter venue"
                handleChangeText={setVenue}
              />
              <EventField
                title="Customer Details"
                value={customerDetails}
                placeholder="Enter customer details"
                handleChangeText={setCustomerDetails}
                style={styles.customerDetailsField}
              />
              <EventField
                title="Event Date"
                value={eventDate}
                placeholder="Select event date"
                isDate={true}
                onDateChange={setEventDate}
              />
              <EventField
                title="Payment Date"
                value={paymentDate}
                placeholder="Select payment date"
                isDate={true}
                onDateChange={setPaymentDate}
              />
            </View>

            <View style={styles.footer}>
              <ActionButton
                label="Back"
                onPress={handleBackPress}
                enabled={true}
                style={styles.footerButton}
              />
              <ActionButton
                label="Create Event"
                onPress={createEvent}
                enabled={previewItems.length == 0}
                style={styles.footerButton}
              />
            </View>
          </ScrollView>
        </View>

      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "95%", // Adjusted for better fit
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  footerButton: {
    width: "45%",
  },
  customerDetailsField: {
    height: 100,
    textAlignVertical: "top", // Ensure text starts from the top
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10, // Add some margin at the bottom if needed
  },
  previewContainer: {
    width: "100%",
    marginBottom: 20,
  },
  previewItemsField: {
    flex: 1, // Take up remaining space
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    width: "95%",
    marginRight: 70,
    padding: 20,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  leftButton: {
    width: "40%",
    marginLeft: 25,
  },
  rightButton: {
    width: "40%",
  },
  addButton: {
    padding: 4,
    maxWidth: 100,
    marginLeft: 25,
  },
  DrawerContainer: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Vertically center items
    padding: 10,
    marginTop: 25,
    borderBottomWidth: 0.5,
  },
  DrawerText: {
    fontSize: 20,
    fontFamily: "MontserratMedium",
    marginLeft: 30, // Add some spacing between the arrow and the text
  },
});

export default addDetail;
