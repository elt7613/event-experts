
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import axios from "axios";
import { createQuery } from "react-query-kit";

export type notificationItems = {
  noId: number;
  emId: string;
  noMessage: string;
  noStatus: string;
  noDate: number;
};

type Response = notificationItems[];
type Variables = void;

export const allNotifications = createQuery<Response, Variables, AxiosError>({
  queryKey: ["all-notifications"],
  fetcher: async () => {
    const url =
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/notifications";
    const response = await axios.get(url);
    
    return response.data;
  },
});