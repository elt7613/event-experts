import type { AxiosError } from "axios";
import axios from "axios";
import { createQuery } from "react-query-kit";

export type Response = {
  emEmailId: string;
  emMobile: string;
  emEventOrg: string;
};
type Variables = void;

export const userInfo = createQuery<Response, Variables, AxiosError>({
  queryKey: ["user-info"],
  fetcher: async () => {
    const url =
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/viewitems";
    const response = await axios.get(url);
    return response.data;
  },
});