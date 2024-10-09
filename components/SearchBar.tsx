import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { EvilIcons, Feather } from "@expo/vector-icons";

const SearchBar = ({
  value,
  placeholder,
  handleChangeText,
  customWidth,
  otherStyle,
  ...props
}: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.cell, { width: customWidth }]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7B7B8B"
        onChangeText={handleChangeText}
      />

      {1 === 1 && (
        <TouchableOpacity
          style={styles.Icon}
          onPress={() => {
            console.log("search");
          }}
        >
          <EvilIcons name="search" size={16} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "MontserratLight",
    maxHeight: 60,
  },
  cell: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: "#000",
    borderRadius: 4,
    padding: 6,
    paddingLeft: 34,
    backgroundColor: "#FFF",
    fontSize: 14,
    color: "#333",
    height: 40,
  },
  Icon: {
    position: "absolute",
    left: 20, // Position the icon on the right inside the input field
    transform: [{ translateY: 34 }],
  },
});
