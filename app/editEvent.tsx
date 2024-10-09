import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventField from "@/components/EventField";
import { useFocusEffect, useGlobalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import ActionButton from "@/components/ActionButton";
import { RefreshControl } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';


const viewEvent = () => {
  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [customerDetails, setCustomerDetails] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined);
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);
  const { KeyId } = useGlobalSearchParams();
  const [AllItems, setAllItems] = useState<any[]>([]);
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});
  const [data, setData] = useState<EventData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  interface EventData {
    eventId: number;
    eventName: string;
    eventDate: string;
    eventDatetime: string;
    paymentDate: string;
    customerDetails: string;
    eventItemsList: any[];
    eventVenue: string;
    eventStatus: string;
  }

  const refetch = async () => {
    try {
      const response = await axios.get(
        `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/event?eventId=${KeyId}`
      );
      setData(response.data);
    } catch (error) {
    }
  };
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      setName(data.eventName);
      setVenue(data.eventVenue);
      setCustomerDetails(data.customerDetails);
      setEventDate(new Date(data.eventDate));
      setPaymentDate(new Date(data.paymentDate));
      setAllItems(data.eventItemsList);
    }
  }, [data]);

  useEffect(() => {
    const checkIfFieldsAreFilled = () => {
      return (
        name.trim() !== "" &&
        venue.trim() !== "" &&
        customerDetails.trim() !== "" &&
        eventDate !== undefined &&
        paymentDate !== undefined
      );
    };

    setIsAddButtonEnabled(checkIfFieldsAreFilled());
  }, [name, venue, customerDetails, eventDate, paymentDate]);

  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      
      refetch();
    }, [])
  );

  const handleBackPress = () => {
    router.back();
  };

  const updateEvent = async () => {
    setIsLoading(true);
    try {
      const data = {
        eventId: KeyId,
        eventName: name,
        eventDate: eventDate?.toISOString(),
        eventDatetime: eventDate?.toISOString(),
        paymentDate: paymentDate?.toISOString(),
        customerDetails: customerDetails,
        eventItemsList: [],
        eventVenue: venue,
        eventStatus: "ONGOING",
      };
      const response = await axios.put(
        `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/updateevent`,
        data
      );
     
      router.replace("/(root)/(screen)/(menu)/eventdetail");
    } catch (error) {
    
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Quotation
  const handleQuotation = async () => {
    setIsLoading(true);

    const event_url = `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/event?eventId=${KeyId}`;
    try {
      const response = await axios.get(event_url);
     
      const payload = {
        eventId: response.data.eventId,
        eventName: response.data.eventName,
        eventDate: response.data.eventDate,
        eventDatetime: response.data.eventDatetime,
        paymentDate: response.data.paymentDate,
        customerDetails: response.data.customerDetails,
        eventItemsList: response.data.eventItemsList,
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
        }
      });
    } catch (error) {
      
    } finally {
    setIsLoading(false);
  }
  };

  const eventItemEditPage = () => {
    router.push(`/editEventItem?KeyId=${KeyId}`);
  }

  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.DrawerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.DrawerText}>Edit Event</Text>
      </View>

      <SafeAreaView style={styles.container}>
        <View style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          >
            <View style={styles.form}>
              <EventField
                title="Name"
                value={name}
                placeholder="Enter your name"
                handleChangeText={setName}
              />
              <EventField
                title="Venue"
                value={venue}
                placeholder="Enter venue"
                handleChangeText={setVenue}
              />
              <EventField
                title="Customer Details"
                value={customerDetails}
                placeholder="Enter customer details"
                handleChangeText={setCustomerDetails}
                style={styles.customerDetailsField}
              />
              <EventField
                title="Event Date"
                value={eventDate}
                placeholder="Select event date"
                isDate={true}
                onDateChange={setEventDate}
              />
              <EventField
                title="Payment Date"
                value={paymentDate}
                placeholder="Select payment date"
                isDate={true}
                onDateChange={setPaymentDate}
              />
            </View>

            <View style={styles.selectionContainer}>
              <Text style={styles.selectedItemsText}>All Items:</Text>
              <View style={styles.selectedItemsBox}>
                {AllItems.map((item, index) => (
                  <Text key={index}>
                    {item.itemName} - {item.quantity}
                  </Text>
                ))}
              </View>
            </View>

              <ActionButton
                label="Edit Items"
                onPress={eventItemEditPage}
                enabled={true}
                style={styles.editButton}
              />

            <View style={styles.footer}>
            <ActionButton
              label={isLoading ? "Generating..." : "Generate Quotation"}
              onPress={handleQuotation}
              enabled={!isLoading}
              style={styles.quotationButton}
            />


              <ActionButton
                label={isLoading ? "Updating..." : "Update Event"}
                onPress={updateEvent}
                enabled={true}
                style={styles.footerButton}
              />
            </View>

          </ScrollView>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    marginTop: 0,
    justifyContent: "space-between",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  footerButton: {
    width: "45%",
    fontFamily: "MontserratMedium",
    backgroundColor: "#fef100",
  },
  quotationButton: {
    width: "45%",
    fontFamily: "MontserratMedium",
  },
  editButton: {
    fontFamily: "MontserratMedium",
    backgroundColor: "#fef100",
    left: 20,
    width: "45%",
  },
  customerDetailsField: {
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  previewContainer: {
    width: "100%",
    marginBottom: 20,
  },
  previewItemsField: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    width: "95%",
    marginRight: 70,
    padding: 20,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  leftButton: {
    width: "40%",
    marginLeft: 25,
  },
  rightButton: {
    width: "40%",
  },
  addButton: {
    padding: 4,
    maxWidth: 100,
    marginLeft: 25,
  },
  DrawerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 25,
    borderBottomWidth: 0.5,
  },
  DrawerText: {
    fontSize: 20,
    fontFamily: "MontserratMedium",
    marginLeft: 30,
  },

  selectionContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  selectedItemsText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  selectedItemsBox: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default viewEvent;
