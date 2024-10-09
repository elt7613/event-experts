import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Variables = {
  id: string | number;
};
type Response = { statuscode: number };

export const useDeleteEvent = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await axios.put(
      `http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/delete/${variables.id}`);
    // console.log(response.data);
    return response.data;
  },
});
