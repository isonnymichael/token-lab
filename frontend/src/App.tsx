import TopBar from './components/TopBar';
import BlocklyWorkspace from './components/BlocklyWorkspace';
import RightPanel from './components/RightPanel';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden font-sans">
        <TopBar />
        <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
          <BlocklyWorkspace />
          <RightPanel />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
