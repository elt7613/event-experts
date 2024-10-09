import { useState, useEffect } from 'react';
import { getEvents } from "@/api/Events/getEvents";

const GetEventId = () => {
  const [lastEventId, setLastEventId] = useState<number | null>(null);
  const { data } = getEvents();
  

  useEffect(() => {
    const fetchLastEventId = async () => {
      const lastEvent = data?[data.length - 1]:"";
      setLastEventId(lastEvent ? 0 : null);
    };
    fetchLastEventId();
  }, []);

  return lastEventId;
};

export default GetEventId;