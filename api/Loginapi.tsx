import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Variables = { username: string; password: string };
type Response = {};

export const useGetToken = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await axios.post(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/api/v1/login",
      {
        username: variables.username,
        password: variables.password,
      }
    );
    // console.log(response.data);
    return response.data;
  },
});
