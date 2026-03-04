"use client"

import { runTest, Test, testCases } from "@/lib/test";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

type TestCaseProps = {
  test: Test
};

type TestCaseHandle = {
  handleRun: () => Promise<void>

}

type Status = 'running' | 'passed' | 'failed' | null;

const statusBadge = (status: Status) => {
  if (!status) return <></>
  if (status === 'passed') return <Badge className="bg-green-950/60 text-green-400 border border-green-600/40 hover:bg-green-950/60">passed</Badge>;
  if (status === 'failed') return <Badge variant="destructive">failed</Badge>;
  return <Badge variant="secondary">running…</Badge>;
};

const TestCase = forwardRef(({ test }: TestCaseProps, ref) => {
  const [status, setStatus] = useState<Status>(null);
  const [message, setMessage] = useState<string>('');
  const [open, setOpen] = useState(true);

  const handleRun = async () => {
      const res = await runTest(test);
      if (res.status == 'passed') {
        setStatus('passed')
      } else {
        setStatus('failed')
        setMessage(res.message)
      }
  }

  useImperativeHandle(ref, () => ({
    handleRun: () => handleRun()
  }))

  return (
    <div className="flex flex-col gap-1 py-2 border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-foreground">{test.name}</span>
        <div className="flex gap-2">
        {message && (
          <button
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}
          </button>
        )}
        {statusBadge(status)}
        {status != "passed" && <Button variant="ghost" size="icon-sm" onClick={handleRun}><Rocket /></Button>}
        </div>
      </div>
      {open && message && (
        <p className="text-xs font-mono text-destructive bg-destructive/10 rounded px-2 py-1 mt-1 break-all">
          {message}
        </p>
      )}
    </div>
  );
})
TestCase.displayName = "TestCase"

type TestSectionProps = {
  name: string;
  tests: Test[];
};

const TestSection = forwardRef(({ name, tests }: TestSectionProps, ref) => {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState("ready");
  const testCasesRefs = useRef<(TestCaseHandle | null)[]>([])

  const runAllTests = async () => {
    setState("loading");
    await Promise.all(testCasesRefs.current.filter(e => !!e).map(e => e.handleRun()));
    setState("ready");
  }

  useImperativeHandle(ref, () => ({
    handleRun: async () => {
      await runAllTests();
    }
  }))

  return (
    <Card>
      <CardHeader className="pb-2 flex justify-between">
        <button
          className="flex items-center gap-2 text-left w-full"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <ChevronDown className="size-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
          <CardTitle className="text-base">{name}</CardTitle>
        </button>
      <Button disabled={state != "ready"} size="sm" onClick={runAllTests}>Run</Button>
      </CardHeader>
      {open && (
        <CardContent>
          <div>
            {tests.map((t) => <TestCase key={t.name} test={t} ref={el => {testCasesRefs.current.push(el as TestCaseHandle);}} />)}
          </div>
        </CardContent>
      )}
    </Card>
  );
});
TestSection.displayName = "TestSection"

export default function TestsPage() {
  const [state, setState] = useState("ready");
  const testSuitesRefs = useRef<(TestCaseHandle | null)[]>([])

  const runAllTests = async () => {
    setState("loading");
    await Promise.all(testSuitesRefs.current.filter(e => !!e).map(e => e.handleRun()));
    setState("ready");
  }

  return (
    <div className="min-h-screen p-4 font-mono text-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6">Test Runner</h1>
          <Button disabled={state != "ready"} size="sm" onClick={runAllTests}>Run</Button>
        </div>
        <div className="space-y-4">
          {Object.entries(testCases).map(([k, v]) => (
            <TestSection key={k} name={k} tests={v} ref={el => {testSuitesRefs.current.push(el as TestCaseHandle)}}/>
          ))}
        </div>
      </div>
    </div>
  );
}
