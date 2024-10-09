import type { AxiosError } from "axios";
import axios from "axios";
import { createMutation } from "react-query-kit";

type Items = {
  id: number,
  itemId: number,
  itemName: string,
  quantity: number,
  eventId: number
}

type Variables = {
  eventId: number,
  eventName: string,
  eventDate: string,
  eventDatetime: string,
  paymentDate: number,
  customerDetails: string,
  eventItemsList: Items,
  eventVenue: string,
  eventStatus: string
};
type Response = { statuscode: number };

export const updateEvent = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const response = await axios.put(
      "http://ec2-35-78-87-126.ap-northeast-1.compute.amazonaws.com:8080/event/updateevent",
      {
        eventId: variables.eventId,
        eventName: variables.eventName,
        eventDate: variables.eventDate,
        eventDatetime: variables.eventDatetime,
        paymentDate: variables.paymentDate,
        customerDetails: variables.customerDetails,
        eventItemsList_id: variables.eventItemsList.id,
        eventItemsList_itemId: variables.eventItemsList.itemId,
        eventItemsList_itemName: variables.eventItemsList.itemName,
        eventItemsList_quantity: variables.eventItemsList.quantity,
        eventItemsList_eventId: variables.eventItemsList.eventId,
        eventVenue: variables.eventVenue,
        eventStatus: variables.eventStatus,
      }
    );
    // console.log(response.data);
    return response.data;
  },
});