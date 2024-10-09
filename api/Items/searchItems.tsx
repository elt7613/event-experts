import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Variables = {
  searchValue: string
};
type Response = { statuscode: number };

export const searchItems = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await axios.post(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/searchitems",
      {
        searchValue: variables.searchValue
      }
    );
    // console.log(response.data);
    return response.data;
  },
});