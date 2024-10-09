import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ActionButton from '@/components/ActionButton';
import { getItems } from '@/api/Items/getItems';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import axios from "axios";

const AddEventItems = () => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});

  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [customerDetails, setCustomerDetails] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);

  // Call hooks inside the component
  const { data } = getItems(); 
  const { KeyId } = useGlobalSearchParams();
  const router = useRouter();

  // getting the event
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/event?eventId=${KeyId}`
        );
        // seeting it to selected items
        setName(response.data.eventName);
        setVenue(response.data.eventVenue);
        setCustomerDetails(response.data.customerDetails);
        setEventDate(new Date(response.data.eventDate));
        setPaymentDate(new Date(response.data.paymentDate));
        setSelectedItems(response.data['eventItemsList']);
        setItemQuantities((prevQuantities) => {
          const updatedQuantities = {...prevQuantities };
          response.data['eventItemsList'].forEach((item: any) => {
            updatedQuantities[item.itemId] = item.quantity;
          });
          return updatedQuantities;
        });
      } catch (error) {
      }
    };
    fetchData();
  }, [KeyId]);

  const handleSelectItem = (item: any) => {
    setSelectedItems((prev) => {
      const isItemSelected = prev.some((selectedItem) => selectedItem.itemId === item.itemId);

      if (isItemSelected) {
        setItemQuantities((prevQuantities) => {
          const updatedQuantities = {...prevQuantities };
          delete updatedQuantities[item.itemId];
          return updatedQuantities;
        });
        return prev.filter((selectedItem) => selectedItem.itemId!== item.itemId);
      }
      setItemQuantities((prevQuantities) => ({...prevQuantities, [item.itemId]: 1 }));
      return [...prev, item];
    });
  };

  const handleQuantityChange = (itemId: number, change: number) => {
    setItemQuantities((prevQuantities) => ({
    ...prevQuantities,
      [itemId]: Math.max(1, (prevQuantities[itemId] || 1) + change),
    }));
  };

  const renderItem = (item: any) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem.itemId === item.itemId);

    return (
      <TouchableOpacity
        key={`item-${item.itemId}`}
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => handleSelectItem(item)}
      >
        <Image source={{ uri: item.itemImagePath }} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.itemName}</Text>
        <Text style={styles.itemPrice}>Price: ₹{item.itemCost}</Text>

        {isSelected && (
          <View style={styles.counterContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.itemId, -1)}
              style={styles.counterButton}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{itemQuantities[item.itemId] || 1}</Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.itemId, 1)}
              style={styles.counterButton}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const SubmitEvents = async () => {
    try {
      const data = {
        eventId: KeyId,
        eventName: name,
        eventDate: eventDate?.toISOString(),
        eventDatetime: eventDate?.toISOString(),
        paymentDate: paymentDate?.toISOString(),
        customerDetails: customerDetails,
        eventItemsList: selectedItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: itemQuantities[item.itemId] || 1,
          eventId: Number(KeyId),
        })),
        eventVenue: venue,
        eventStatus: "ONGOING",
      };
     
      const response = await axios.put(
        `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/updateevent`,
        data
      );
      
      router.back();
    } catch (error) {
     
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.itemsGrid}>{data?.map((item: any) => renderItem(item))}</View>
      </ScrollView>

      {selectedItems.length > 0 && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectedItemsText}>Selected Items:</Text>
          <View style={styles.selectedItemsBox}>
            {selectedItems.map((item) => (
              <Text key={item.itemId}>
                {item.itemName} - {itemQuantities[item.itemId] || 1}
              </Text>
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            <ActionButton
              label="Update"
              onPress={SubmitEvents}
              enabled={true}
              style={styles.rightButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  selectedItem: {
    borderColor: 'blue',
  },
  itemImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  counterButton: {
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  counterText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  selectionContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  selectedItemsText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedItemsBox: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftButton: {
    width: '45%',
  },
  rightButton: {
    left: 95,
    width: '45%',
    fontFamily: "MontserratMedium",
    backgroundColor: "#fef100",
  },
});

export default AddEventItems;
