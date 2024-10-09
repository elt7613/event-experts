import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import QuantitySelector from "./QuantitySelector"; // Adjust import path as necessary
import ActionButton from "./ActionButton";
import { Feather } from "@expo/vector-icons"; // Ensure you've installed @expo/vector-icons

interface Item {
  itemId: string;
  itemName: string;
  itemImagePath: any;
  itemCost: number;
}

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  items: Item[];
  onAddItem: (selectedItems: Item[]) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  items,
  onAddItem,
}) => {
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: { item: Item; quantity: number };
  }>({});

  const handleItemPress = (item: Item) => {
    setSelectedItems((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[item.itemId]) {
        // Item already selected, deselect it
        delete newSelected[item.itemId];
      } else {
        // Item not selected, add it
        newSelected[item.itemId] = { item, quantity: 1 };
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setSelectedItems((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[itemId]) {
        newSelected[itemId].quantity = newQuantity;
      }
      return newSelected;
    });
  };

  const handleAddItems = () => {
    const itemsToAdd = Object.values(selectedItems).map(
      ({ item, quantity }) => ({
        ...item,
        price: item.itemCost * quantity, // Adjust price based on quantity if needed
        quantity,
      })
    );
    onAddItem(itemsToAdd);
    onClose();
  };

  const renderItem = (item: Item) => {
    const isSelected = !!selectedItems[item.itemId];
    return (
      <TouchableOpacity
        key={item.itemId}
        onPress={() => handleItemPress(item)}
        style={[styles.itemContainer, isSelected && styles.itemSelected]}
      >
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Image source={{ uri: `${item.itemImagePath}` }} style={styles.itemImage} />
        <View style={styles.textContainer}>
          <Text style={styles.itemPrice}>${item.itemCost.toFixed(2)}</Text>
          {isSelected && (
            <QuantitySelector
              itemId={item.itemId}
              quantity={selectedItems[item.itemId]?.quantity || 1}
              onQuantityChange={handleQuantityChange}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const rows = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.gridContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Feather name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>ALL ITEMS</Text>
            </View>
            <ScrollView>
              <View style={styles.itemsContainer}>
                {rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {row.map((item) => renderItem(item))}
                  </View>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <ActionButton
                  label={`ADD ${Object.keys(selectedItems).length} ITEM${
                    Object.keys(selectedItems).length > 1 ? "S" : ""
                  }`}
                  onPress={handleAddItems}
                  enabled={Object.keys(selectedItems).length > 0}
                  variant="modal"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    height: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  gridContainer: {
    width: "90%",
    height: "99%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "400",
    marginLeft: 10, // Space between arrow and title
  },
  itemsContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemContainer: {
    alignItems: "center",
    width: "30%",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 5,
  },
  itemSelected: {
    borderColor: "yellow", // Highlight selected items
  },
  itemImage: {
    width: 70,
    height: 80,
    borderRadius: 10,
    marginBottom: 3,
  },
  textContainer: {
    alignItems: "center",
  },
  itemName: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 20,
  },
});

export default AddItemModal;