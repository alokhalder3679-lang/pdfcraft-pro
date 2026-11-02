import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ContactModal } from './components/ContactModal';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { PDF_TOOLS } from './types/tools';
import { updateDocumentSEO } from './services/seoService';

export const App: React.FC = () => {
  const [currentToolId, setCurrentToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [preloadedFiles, setPreloadedFiles] = useState<File[]>([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);

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

  // Synchronize SEO Title, Meta Tags, Canonical URL & Schema per route
  useEffect(() => {
    updateDocumentSEO(currentToolId);
  }, [currentToolId]);

  const handleSelectTool = (toolId: string | null, files?: File[]) => {
    setCurrentToolId(toolId);
    if (files && files.length > 0) {
      setPreloadedFiles(files);
    } else {
      setPreloadedFiles([]);
    }
    if (toolId) {
      window.history.pushState({}, '', `/tools/${toolId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar
        onSelectTool={handleSelectTool}
        currentToolId={currentToolId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenContact={() => setContactModalOpen(true)}
      />

      <main className="flex-1">
        {currentToolId ? (
          <ToolPage
            toolId={currentToolId}
            onBack={() => handleSelectTool(null)}
            onSelectTool={handleSelectTool}
            preloadedFiles={preloadedFiles}
          />
        ) : (
          <HomePage
            onSelectTool={handleSelectTool}
            searchQuery={searchQuery}
          />
        )}
      </main>

      <Footer
        onSelectTool={handleSelectTool}
        onOpenContact={() => setContactModalOpen(true)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        currentToolId={currentToolId}
      />
    </div>
  );
};

export default App;
