import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const PastEvent = ({ title, address, date, KeyId }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (timestamp: string) => {
    const dateObj = new Date(parseInt(timestamp));
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
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
        
        {isDeleting ? (
            <ActivityIndicator size="small" color="#0195B5" style={styles.icon} />
            ) : (
          <FontAwesome
            name="trash"
            size={20}
            color="black"
            onPress={() => {
              handleDelete(KeyId);
            }}
            style={styles.icon}
          />)}
      </View>
      <Text style={{ lineHeight: 20, color: "#c2c0ba", fontSize: 12 }}>
        {address}
      </Text>
      <Text>{formatDate(date)}.</Text>
    </View>
  );
};

export default PastEvent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    backgroundColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#838383",
    height: 80,
    minWidth: "90%",
  },
  icon: {
    marginLeft: 15,
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
  iconContainer: {
    flexDirection: "row",
  },
});
