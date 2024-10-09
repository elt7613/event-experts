import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import axios from "axios";
import { createQuery } from "react-query-kit";

export type EventItems = {
  itemId: number;
  itemName: string;
  itemType: string;
  itemDesc: string;
  itemCost: number;
  itemImagePath: string;
  itemAddFields: string;
  imageString: string;
};

type Response = EventItems[];
type Variables = void;

export const getItems = createQuery<Response, Variables, AxiosError>({
  queryKey: ["get-items"],
  fetcher: async (_, { signal }) => {
    const token = await AsyncStorage.getItem("Token");
    const url =
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/items";
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
      signal,
    });
    return response.data;
  },
});
