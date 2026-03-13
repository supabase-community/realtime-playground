import { TestSuite } from '..'
import { signInUser, waitFor, waitForChannel } from '../helpers'
import assert from 'assert'

export default {
  'broadcast changes': [
    {
      name: "authenticated user receives INSERT broadcast change",
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const id = crypto.randomUUID();
        const value = crypto.randomUUID();
        let result: any = null;

        const channel = supabase
          .channel("topic:test", { config: { private: true } })
          .on("broadcast", { event: "INSERT" }, (res) => (result = res))
          .subscribe();

        await waitForChannel(channel);
        await supabase.from("broadcast_changes").insert({ value, id });
        await waitFor(() => result);

        assert.strictEqual(result.payload.record.id, id);
        assert.strictEqual(result.payload.record.value, value);
        assert.strictEqual(result.payload.old_record, null);
        assert.strictEqual(result.payload.operation, "INSERT");
        assert.strictEqual(result.payload.schema, "public");
        assert.strictEqual(result.payload.table, "broadcast_changes");
      }
    },
    {
      name: "authenticated user receives UPDATE broadcast change",
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const id = crypto.randomUUID();
        const originalValue = crypto.randomUUID();
        const updatedValue = crypto.randomUUID();
        await supabase.from("broadcast_changes").insert({ value: originalValue, id });
        let result: any = null;

        const channel = supabase
          .channel("topic:test", { config: { private: true } })
          .on("broadcast", { event: "UPDATE" }, (res) => (result = res))
          .subscribe();

        await waitForChannel(channel);
        await supabase.from("broadcast_changes").update({ value: updatedValue }).eq("id", id);
        await waitFor(() => result);

        assert.strictEqual(result.payload.record.id, id);
        assert.strictEqual(result.payload.record.value, updatedValue);
        assert.strictEqual(result.payload.old_record.id, id);
        assert.strictEqual(result.payload.old_record.value, originalValue);
        assert.strictEqual(result.payload.operation, "UPDATE");
        assert.strictEqual(result.payload.schema, "public");
        assert.strictEqual(result.payload.table, "broadcast_changes");
      }
    },
    {
      name: "authenticated user receives DELETE broadcast change",
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const id = crypto.randomUUID();
        const value = crypto.randomUUID();
        await supabase.from("broadcast_changes").insert({ value, id });
        let result: any = null;

        const channel = supabase
          .channel("topic:test", { config: { private: true } })
          .on("broadcast", { event: "DELETE" }, (res) => (result = res))
          .subscribe();

        await waitForChannel(channel);
        await supabase.from("broadcast_changes").delete().eq("id", id);
        await waitFor(() => result);
      }
    }
  ],
} satisfies TestSuite
