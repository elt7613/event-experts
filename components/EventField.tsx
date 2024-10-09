import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";

const EventField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  isDate,
  onDateChange,
  ...props
}: any) => {
  const [showPassword, setShowPassword] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.inputContainer}>
        {isDate ? (
          <>
            <TouchableOpacity
              style={styles.cell}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {value ? value.toLocaleDateString() : placeholder}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
            )}
          </>
        ) : (
          <TextInput
            style={styles.cell}
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleChangeText}
            secureTextEntry={title === "Password" && showPassword}
            {...props}
          />
        )}
        {title === "Password" && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#7B7B8B"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EventField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "90%", // Adjust width to ensure the component fits well
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    padding: 10, // Increased padding for better touch experience
    backgroundColor: "#FFF",
    fontSize: 14,
    color: "#333",
    justifyContent: "center",
  },
  dateText: {
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  datePicker: {
    position: "absolute",
    width: "100%", // Ensure date picker covers the input area
  },
});
