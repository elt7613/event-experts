import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import axios from "axios";
import { createQuery } from "react-query-kit";

type Variables = {
  hash: string;
  showCost: boolean;
};

export const getDetailsByHash = createQuery<Response, Variables, AxiosError>({
  queryKey: ["get-details-by-hash"],
  fetcher: async ({ hash, showCost }, { signal }) => {
    const token = await AsyncStorage.getItem("Token");
    const url =
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/users/getdetailsbyhash";
    const response = await axios.get(url, {
      params: { hash, showCost },
      signal,
    });
    // console.log(response.data);
    return response.data;
  },
});
