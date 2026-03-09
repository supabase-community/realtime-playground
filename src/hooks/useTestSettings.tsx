import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_KEY,
} from "@/lib/constants";

interface TestSettings {
  supabase_url: string;
  supabase_key: string;
}

interface TestSettingsContextValue extends TestSettings {
  setSupabaseUrl: (url: string) => void;
  setSupabaseKey: (key: string) => void;
}

const TestSettingsContext = createContext<TestSettingsContextValue | null>(null);

export function TestSettingsProvider({ children }: { children: ReactNode }) {
  const [supabaseUrl, setSupabaseUrl] = useState(NEXT_PUBLIC_SUPABASE_URL);
  const [supabaseKey, setSupabaseKey] = useState(NEXT_PUBLIC_SUPABASE_KEY);

  const value: TestSettingsContextValue = {
    supabase_url: supabaseUrl,
    supabase_key: supabaseKey,
    setSupabaseUrl: useCallback((url: string) => setSupabaseUrl(url), []),
    setSupabaseKey: useCallback((key: string) => setSupabaseKey(key), []),
  };

  return (
    <TestSettingsContext.Provider value={value}>
      {children}
    </TestSettingsContext.Provider>
  );
}

export function useTestSettings(): TestSettingsContextValue {
  const context = useContext(TestSettingsContext);
  if (!context) {
    throw new Error(
      "useTestSettings must be used within a TestSettingsContext.Provider"
    );
  }
  return context;
}
