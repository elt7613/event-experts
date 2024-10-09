import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosError } from "axios";
import axios from "axios";
import { createQuery } from "react-query-kit";

type Variables = void;

export const getHash = createQuery<Response, Variables, AxiosError>({
  queryKey: ["get-hash"],
  fetcher: async (_, { signal }) => {
    const token = await AsyncStorage.getItem("Token");
    const url =
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/users/sharehash";
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
      signal,
    });
    // console.log(response.data.hashValue);
    return response.data.hashValue;
  },
});
