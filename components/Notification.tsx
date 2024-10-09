import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Notification = ({ Company, Email, Phone }: any) => {
  return (
    <View style={style.container}>
      {/* Company centered at the top */}
      <Text style={style.companyText}>{Company}</Text>

      {/* Email and Phone displayed on the left and right below the company */}
      <View style={style.infoRow}>
        <Text style={style.emailText}>{Email}</Text>
        <Text style={style.phoneText}>{Phone}</Text>
      </View>
    </View>
  );
};

export default Notification;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  companyText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row", // Align Email and Phone horizontally
    justifyContent: "space-between", // Push them to the sides
    width: "100%", // Ensure row takes full width
    paddingHorizontal: 20, // Padding for left and right spacing
    marginTop: 10,
  },
  emailText: {
    flex: 1, // This ensures Email sticks to the left
    textAlign: "left",
  },
  phoneText: {
    flex: 1, // This ensures Phone sticks to the right
    textAlign: "right",
  },
});
