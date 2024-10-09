import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Response = { statuscode: number };
type Input = number[];

export const useReadNotifications = createMutation<Response,Input, AxiosError>({
  mutationFn: async (input: Input) => {
    const response = await axios.post(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/readnotifications",
      input
    );
    // console.log(response.data);
    return response.data;
  },
});