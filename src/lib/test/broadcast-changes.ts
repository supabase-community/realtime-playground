import { createClient } from "@supabase/supabase-js";
import { TestSuite } from ".";
import { signInUser, waitFor } from "./helpers";
import assert from "assert";

const realtime = { heartbeatIntervalMs: 5000, timeout: 5000 };

export default {
  "broadcast changes": [
    {
      name: "authenticated user receives insert broadcast change from a specific topic based on id",
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime });
        await signInUser(supabase, "filipe@supabase.io", "test_test");
        await supabase.realtime.setAuth();

        const table = "broadcast_changes";
        const id = crypto.randomUUID();
        const originalValue = crypto.randomUUID();
        const updatedValue = crypto.randomUUID();

        let insertResult: any, updateResult: any, deleteResult: any;

        const channel = supabase
          .channel("topic:test", { config: { private: true } })
          .on("broadcast", { event: "INSERT" }, (res) => (insertResult = res))
          .on("broadcast", { event: "DELETE" }, (res) => (deleteResult = res))
          .on("broadcast", { event: "UPDATE" }, (res) => (updateResult = res))
          .subscribe();

        await waitFor(() => channel.state == "joined")

        // Test inserts
        await supabase.from(table).insert({ value: originalValue, id });
        await waitFor(() => !!insertResult);
        assert.equal(insertResult.payload.record.id, id);
        assert.equal(insertResult.payload.record.value, originalValue);
        assert.equal(insertResult.payload.old_record, null);
        assert.equal(insertResult.payload.operation, "INSERT");
        assert.equal(insertResult.payload.schema, "public");
        assert.equal(insertResult.payload.table, "broadcast_changes");

        // Test updates
        await supabase.from(table).update({ value: updatedValue }).eq("id", id);
        await waitFor(() => (!!updateResult));
        assert.equal(updateResult.payload.record.id, id);
        assert.equal(updateResult.payload.record.value, updatedValue);
        assert.equal(updateResult.payload.old_record.id, id);
        assert.equal(updateResult.payload.old_record.value, originalValue);
        assert.equal(updateResult.payload.operation, "UPDATE");
        assert.equal(updateResult.payload.schema, "public");
        assert.equal(updateResult.payload.table, "broadcast_changes");

        // Test deletes
        await supabase.from(table).delete().eq("id", id);
        await waitFor(() => (!!deleteResult));
        assert.equal(deleteResult.payload.record, null);
        assert.equal(deleteResult.payload.old_record.id, id);
        assert.equal(deleteResult.payload.old_record.value, updatedValue);
        assert.equal(deleteResult.payload.operation, "DELETE");
        assert.equal(deleteResult.payload.schema, "public");
        assert.equal(deleteResult.payload.table, "broadcast_changes");
      }
    }
  ]
} satisfies TestSuite
