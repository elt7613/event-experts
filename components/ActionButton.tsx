import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  enabled: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "default" | "modal"; // Add a variant prop for different styles
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  enabled,
  style,
  textStyle,
  variant = "default",
}) => {
  const buttonStyles = [styles.button, { opacity: enabled ? 1 : 0.5 }, style];
  if (variant === "modal") {
    buttonStyles.push(styles.modalButton);
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={!enabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#fef100", // Different color for modal button
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default ActionButton;
