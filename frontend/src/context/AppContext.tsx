import { createContext, useContext, useState, type ReactNode } from 'react';

export interface TokenConfig {
  buy?: { tax: number; split?: any };
  sell?: { tax: number; split?: any };
  transfer?: { tax: number; split?: any };
  maxWallet?: number;
  maxTx?: number;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  supply: number;
  decimals: number;
  network: string;
  logoUrl: string;
  description: string;
}

export interface Allocation {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

interface AppState {
  isValid: boolean;
  errors: string[];
  config: TokenConfig | null;
  tokenInfo: TokenInfo;
  allocations: Allocation[];
  setValidation: (isValid: boolean, errors: string[]) => void;
  setConfig: (config: TokenConfig) => void;
  setTokenInfo: (info: TokenInfo) => void;
  setAllocations: (allocs: Allocation[]) => void;
}


const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [config, setConfig] = useState<TokenConfig | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    name: 'MyToken',
    symbol: 'MTK',
    supply: 1000000000, // 1 Billion standard
    decimals: 18,
    network: 'Sepolia',
    logoUrl: '',
    description: ''
  });
  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: '1', name: 'Community', percentage: 40, color: '#3b82f6' }, // blue-500
    { id: '2', name: 'Team', percentage: 20, color: '#a855f7' },     // purple-500
    { id: '3', name: 'Treasury', percentage: 20, color: '#eab308' }, // yellow-500
    { id: '4', name: 'Liquidity', percentage: 20, color: '#22c55e' }  // green-500
  ]);

  return (
    <AppContext.Provider
      value={{
        isValid,
        errors,
        config,
        tokenInfo,
        allocations,
        setValidation: (v, e) => { setIsValid(v); setErrors(e); },
        setConfig,
        setTokenInfo,
        setAllocations
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
