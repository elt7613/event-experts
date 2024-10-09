import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";


type Items = {
  itemId: number;
  itemName: string;
  quantity: number;
  eventId: number;
}

type Variables = {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventDatetime: string;
  paymentDate: number;
  customerDetails: string;
  eventItemsList: Items[];
  eventVenue: string;
  eventStatus: string;
};

type Response = {};

export const generateQuotation = createMutation<Response, Variables, AxiosError>({
  mutationFn: async ({variables}: any) => {
    const token = await AsyncStorage.getItem("Token");

    const response = await axios.post(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/generatequotation",
      {
        eventName: variables.eventName,
        eventDate: variables.eventDate,
        eventDatetime: variables.eventDatetime,
        paymentDate: variables.paymentDate,
        customerDetails: variables.customerDetails,
        eventItemsList: [
          {
            itemId: variables.Items.itemId,
            itemName: variables.Items.itemName,
            quantity: variables.Items.quantity,
            eventId: variables.Items.eventId
          },
        ],
        eventVenue: variables.eventVenue,
        eventStatus: variables.eventStatus
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data);
    return response.data;
  },
});