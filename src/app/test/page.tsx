"use client"

import { runTest, Test, testCases } from "@/lib/test";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

type TestCaseProps = {
  test: Test
};

type Status = 'running' | 'passed' | 'failed';

const statusBadge = (status: Status) => {
  if (status === 'passed') return <Badge className="bg-green-950/60 text-green-400 border border-green-600/40 hover:bg-green-950/60">passed</Badge>;
  if (status === 'failed') return <Badge variant="destructive">failed</Badge>;
  return <Badge variant="secondary">running…</Badge>;
};

const TestCase = ({ test }: TestCaseProps) => {
  const [status, setStatus] = useState<Status>('running');
  const [message, setMessage] = useState<string>('');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await runTest(test);
      if (res.status == 'passed') {
        setStatus('passed')
      } else {
        setStatus('failed')
        setMessage(res.message)
      }
    })()
  }, [test])

  return (
    <div className="flex flex-col gap-1 py-2 border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-foreground">{test.name}</span>
        {message ? (
          <button
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}
            {statusBadge(status)}
          </button>
        ) : statusBadge(status)}
      </div>
      {open && message && (
        <p className="text-xs font-mono text-destructive bg-destructive/10 rounded px-2 py-1 mt-1 break-all">
          {message}
        </p>
      )}
    </div>
  );
}

type TestSectionProps = {
  name: string;
  tests: Test[];
};

const TestSection = ({ name, tests }: TestSectionProps) => {
  const [open, setOpen] = useState(true);

  return (
    <Card>
      <CardHeader className="pb-2">
        <button
          className="flex items-center gap-2 text-left w-full"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <ChevronDown className="size-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
          <CardTitle className="text-base">{name}</CardTitle>
        </button>
      </CardHeader>
      {open && (
        <CardContent>
          <div>
            {tests.map((t) => <TestCase key={t.name} test={t} />)}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default function TestsPage() {
  return (
    <div className="min-h-screen p-4 font-mono text-sm">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Test Runner</h1>
        <div className="space-y-4">
          {Object.entries(testCases).map(([k, v]) => (
            <TestSection key={k} name={k} tests={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
