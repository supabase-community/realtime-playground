import { TestSuite } from "..";
import { measureThroughput, signInUser, sleep, waitForChannel } from "../helpers";

const LOAD_MESSAGES = 20
const LOAD_SETTLE_MS = 5000
const LOAD_DELIVERY_SLO = 99

export default {
  "load-broadcast-replay": [
    {
      name: "broadcast replay throughput",
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const event = crypto.randomUUID();
        const topic = "topic:" + crypto.randomUUID();

        const since = Date.now() - 1000;
        await Promise.all(Array.from({ length: LOAD_MESSAGES }, (_, i) =>
          supabase.from("replay_check").insert({ id: crypto.randomUUID(), topic, event, payload: { seq: i } })
        ));


        const latencies: number[] = [];
        const replayStart = Date.now();
        const receiver = supabase.channel(topic, {
          config: { private: true, broadcast: { replay: { since, limit: 25 } } },
        }).on("broadcast", { event }, () => {
          latencies.push(Date.now() - replayStart);
        }).subscribe();

        await waitForChannel(receiver);
        await sleep(LOAD_SETTLE_MS);

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO);
      }
    }
  ]
} satisfies TestSuite
