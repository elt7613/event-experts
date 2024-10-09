import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import Notification from "./Notification";

const NotificationDisplay = ({ title, KeyId, status }: any) => {
  
  return (
    <>
  {status == "Read" ? (
    <View key={KeyId} style={styles.container2}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  ) : (
    <View key={KeyId} style={styles.container1}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  )}
</>

  );
};

export default NotificationDisplay;

const styles = StyleSheet.create({
  container1: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    backgroundColor: "#C7F9FF",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#0195B5",
    height: 80,
    minWidth: "90%",
  },
  container2: {
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
  icon: {
    marginLeft: 15,
  },
});
