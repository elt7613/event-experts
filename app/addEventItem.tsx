
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ActionButton from '@/components/ActionButton';
import { getItems } from '@/api/Items/getItems';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { generateQuotation } from '@/api/Events/generateQuotation';
import { useGetEvent } from '@/api/Events/getEvent';
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';
import { useAddEventItems } from '@/api/Events/addEventItems';

const AddEventItems = () => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});

  // Call hooks inside the component
  const { data } = getItems(); 
  const { KeyId } = useGlobalSearchParams();
  const { mutate: addQuotation } = generateQuotation();
  const router = useRouter();

  // Adding eventItem
  const { mutate: addEventItems } = useAddEventItems();

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
        key={item.itemId}
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

  const handleQuotation = async () => {
    const event_url = `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/event?eventId=${KeyId}`;
    try {
      const response = await axios.get(event_url);
      // console.log('useGetEvent called with keyID:', response.data);
  
      // Create a single event with all the selected items
      const payload = {
        eventId: response.data.eventId,
        eventName: response.data.eventName,
        eventDate: response.data.eventDate,
        eventDatetime: response.data.eventDatetime,
        paymentDate: response.data.paymentDate,
        customerDetails: response.data.customerDetails,
        eventItemsList: selectedItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: itemQuantities[item.itemId] || 1,
          eventId: Number(KeyId),
        })),
        eventVenue: response.data.eventVenue,
        eventStatus: response.data.eventStatus,
      };
  
      // Generate the quotation
      const result = await axios.post('http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/generatequotation', payload, {
        responseType: 'arraybuffer',
      });
  
      // Convert ArrayBuffer to Base64
      const base64 = Buffer.from(result.data, 'binary').toString('base64');
  
      // Check if the Base64 string is valid
      if (!base64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
        throw new Error('Invalid Base64 string');
      }
  
      const fileUri = FileSystem.documentDirectory + 'quotation.docx';
  
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Open the file using a compatible application
      await FileSystem.getInfoAsync(fileUri).then((fileInfo) => {
        if (fileInfo.exists) {
          Sharing.shareAsync(fileUri);
        } else {
          // console.error('File does not exist');
        }
      });
    } catch (error) {
      // console.error(error);
    }
  };

  const SubmitEvents = async () => {
    try {
      // console.log('KeyId:', KeyId);
      // console.log('Number(KeyId):', Number(KeyId));
      // console.log("Item selected: ", selectedItems);
  
      const payload = selectedItems.map((item: any) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: itemQuantities[item.itemId] || 1,
        eventId: Number(KeyId)
      }));
  
      // console.log('Payload:', payload);
  
      const response = await axios.post('http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/addeventitems', payload);
    
      router.replace('/(root)/(screen)/(menu)/eventdetail');
    } catch (error) {
      // console.error("Error adding event:", error);
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
              label="Generate Quotation"
              onPress={handleQuotation}
              enabled={true}
              style={styles.leftButton}
            />
            <ActionButton
              label="Submit"
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
    width: '45%',
  },
});

export default AddEventItems;
