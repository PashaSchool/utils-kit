import { useEffect } from "react";
import { BROADCAST_CHANNEL_NAME } from "../core/contants";

type Payload = {
  total: number;
  loadedItemsCount: number;
  state: "progress" | "failed" | "done";
};

function useMessageExportCSV(cb: (payload: Payload) => void) {
  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    channel.addEventListener("message", (params: MessageEvent) => {
      try {
        const json = JSON.parse(params.data) as Payload;

        cb(json);
      } catch (error) {
        console.error({ error });
      }
    });

    return () => {
      channel.close();
    };
  }, [cb]);
}

export default useMessageExportCSV;
