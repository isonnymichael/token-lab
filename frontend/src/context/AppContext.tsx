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
  network: string;
}

interface AppState {
  isValid: boolean;
  errors: string[];
  config: TokenConfig | null;
  tokenInfo: TokenInfo;
  setValidation: (isValid: boolean, errors: string[]) => void;
  setConfig: (config: TokenConfig) => void;
  setTokenInfo: (info: TokenInfo) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [config, setConfig] = useState<TokenConfig | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    name: 'MyToken',
    symbol: 'MTK',
    supply: 1000000,
    network: 'Ethereum'
  });

  return (
    <AppContext.Provider 
      value={{ 
        isValid, 
        errors, 
        config, 
        tokenInfo,
        setValidation: (v, e) => { setIsValid(v); setErrors(e); }, 
        setConfig,
        setTokenInfo
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
