import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { PDF_TOOLS } from './types/tools';

export const App: React.FC = () => {
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle URL route synchronization
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/tools/')) {
        const toolId = path.replace('/tools/', '');
        const exists = PDF_TOOLS.some((t) => t.id === toolId);
        if (exists) {
          setCurrentToolId(toolId);
          return;
        }
      }
      setCurrentToolId(null);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleSelectTool = (toolId: string | null) => {
    setCurrentToolId(toolId);
    if (toolId) {
      window.history.pushState({}, '', `/tools/${toolId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC]">
      <Navbar
        onSelectTool={handleSelectTool}
        currentToolId={currentToolId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {currentToolId ? (
          <ToolPage
            toolId={currentToolId}
            onBack={() => handleSelectTool(null)}
            onSelectTool={handleSelectTool}
          />
        ) : (
          <HomePage
            onSelectTool={handleSelectTool}
            searchQuery={searchQuery}
          />
        )}
      </main>

      <Footer onSelectTool={handleSelectTool} />
    </div>
  );
};

export default App;
