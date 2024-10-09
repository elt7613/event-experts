import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { Alert } from "react-native";

const UpcomingEvent = ({ title, address, date, KeyId, item }: any) => {
  const navigation = useNavigation();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (timestamp: string) => {
    const dateObj = new Date(parseInt(timestamp)); // Convert the timestamp to a Date object
    const day = String(dateObj.getDate()).padStart(2, "0"); // Get day and ensure it's 2 digits
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so +1)
    const year = dateObj.getFullYear(); // Get full year
      
    return `${day}/${month}/${year}`; // Return in "DD-MM-YYYY" format
  };

  const router = useRouter();

  const handleAddItems = () => {
    router.push(`/addEventItem?KeyId=${KeyId}`); 
  };

  // Edit Evnt
  const viewEvent = () => {
    router.push(`/editEvent?KeyId=${KeyId}`); 
  };

  // Event Deleting
  const handleDelete = async (keyID: string | number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Yes",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = await axios.put(
                `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/delete/${keyID}`
              );
              Alert.alert("Success", "Event is deleted successfully!", [{ text: "OK" }]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete event. Please try again.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          text: "No",
          onPress: () => console.log("Delete cancelled"),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View key={KeyId} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        { item == '' ? (
          <TouchableOpacity onPress={handleAddItems} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Items</Text>
          </TouchableOpacity>
        ):(
          <View style={styles.iconContainer}>
            <MaterialIcons name="event-note" size={22}  style={styles.icon} color="black" onPress={viewEvent} />
            {isDeleting ? (
              <ActivityIndicator size="small" color="#0195B5" style={styles.icon} />
            ) : (
              <FontAwesome
                name="trash"
                size={20}
                color="black"
                onPress={() => handleDelete(KeyId)}
                style={styles.icon}
              />
            )}
          </View>
        )}
      </View>
      <Text style={{ lineHeight: 20, color: "#6e6c67", fontSize: 12 }}>
        {address}
      </Text>
      <Text>{formatDate(date)}.</Text>
    </View>
  );
};

export default UpcomingEvent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    backgroundColor: "#C7F9FF",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#0195B5",
    height: 90,
    minWidth: "90%",
  },
  bold: {
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1, // Ensures the title takes available space
  },
  addButton: {
    backgroundColor: "#0195B5",
    borderRadius: 4,
    padding: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 15,
  },
  iconContainer: {
    flexDirection: "row",
  },
});
