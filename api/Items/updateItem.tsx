import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Variables = {
  itemId: number,
  itemName: string,
  itemType: string,
  itemDesc: string,
  itemCost: number,
  itemImagePath: string,
  itemAddFields: string,
  imageString: string
};
type Response = { statuscode: number };

export const updateItem = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await axios.post(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/updateitem",
      {
        itemId: variables.itemId,
        itemName: variables.itemName,
        itemType: variables.itemType,
        itemDesc: variables.itemDesc,
        itemCost: variables.itemCost,
        itemImagePath: variables.itemImagePath,
        itemAddFields: variables.itemAddFields,
        imageString: variables.imageString
      }
    );
    // console.log(response.data);
    return response.data;
  },
});