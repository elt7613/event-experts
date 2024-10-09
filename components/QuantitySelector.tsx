import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface QuantitySelectorProps {
  itemId: string;
  quantity: number;
  onQuantityChange: (id: string, newQuantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  itemId,
  quantity,
  onQuantityChange,
}) => {
  const handleIncrease = () => {
    onQuantityChange(itemId, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(itemId, quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDecrease} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{quantity}</Text>
      <TouchableOpacity onPress={handleIncrease} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  button: {
    backgroundColor: "yellow",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  quantityText: {
    fontSize: 12,
    marginHorizontal: 3,
  },
});

export default QuantitySelector;
