import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Variables = {
  firstName: string;
  password: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  matchingPassword: string;
  emEventOrg: string;
  gender: string;
  surName: string;
  active: boolean;
};
type Response = [];

export const useCreateUser = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await axios.post(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/users/signup",
      {
        firstName: variables.firstName,
        password: variables.password,
        lastName: variables.lastName,
        emailId: variables.emailId,
        phoneNumber: variables.phoneNumber,
        matchingPassword: variables.matchingPassword,
        emEventOrg: variables.emEventOrg,
        surName: variables.surName,
        gender: variables.gender,
        active: variables.active,
      }
    );
    // console.log(response.data);
    // console.log("hello");
    return response.data;
  },
});
