import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import axios from "axios";
import { createQuery } from "react-query-kit";

export type Items = {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  eventId: number;
};

export type Events = {
  eventId: number;
  eventName: string;
  eventDate: string;
  eventDatetime: string;
  paymentDate: number;
  customerDetails: string;
  eventItemsList: Items;
  eventVenue: string;
  eventStatus: string;
};

type Response = Events[];
type Variables = void;

export const getEvents = createQuery<Response, Variables, AxiosError>({
  queryKey: ["get-events"],
  fetcher: async (_, {}) => {
    const token = await AsyncStorage.getItem("Token");
    const url =
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/events";
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  },
});
