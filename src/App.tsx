import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { AppDataProvider } from './context/AppDataContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { DonateModal } from './components/DonateModal.tsx';
import { AIAssistantModal } from './components/AIAssistantModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';

import { LandingPage } from './pages/LandingPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.tsx';
import { NeedsBoardPage } from './pages/NeedsBoardPage.tsx';
import { TransparencyPage } from './pages/TransparencyPage.tsx';
import { VolunteersPage } from './pages/VolunteersPage.tsx';
import { GalleryPage } from './pages/GalleryPage.tsx';
import { CorporatePortal } from './pages/CorporatePortal.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { ReputationPage } from './pages/ReputationPage.tsx';
import { Project } from './types.js';

const getTabFromPath = (): string => {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!path) return 'home';
  if (path === 'admin') return 'admin';
  if (path === 'projects') return 'projects';
  if (path === 'needs') return 'needs';
  if (path === 'transparency') return 'transparency';
  if (path === 'reputation' || path === 'leaderboard') return 'reputation';
  if (path === 'volunteers') return 'volunteers';
  if (path === 'gallery') return 'gallery';
  if (path === 'corporate' || path === 'sponsors') return 'corporate';
  if (path === 'about') return 'about';
  if (path === 'contact') return 'contact';
  return 'home';
};

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState(getTabFromPath);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donateDefaultProject, setDonateDefaultProject] = useState<string | undefined>(undefined);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const setCurrentTab = (tab: string, updateUrl = true) => {
    setCurrentTabState(tab);
    if (updateUrl) {
      const newPath = tab === 'home' ? '/' : `/${tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentTabState(getTabFromPath());
      setSelectedProject(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleOpenDonate = (projectId?: string) => {
    setDonateDefaultProject(projectId);
    setIsDonateOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans transition-colors selection:bg-[#F27D26] selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedProject(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openDonateModal={handleOpenDonate}
        openAiModal={() => setIsAiOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {selectedProject ? (
          <ProjectDetailPage
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            openDonateModal={handleOpenDonate}
            setCurrentTab={setCurrentTab}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <LandingPage
                setCurrentTab={setCurrentTab}
                onSelectProject={handleSelectProject}
                openDonateModal={handleOpenDonate}
              />
            )}
            {currentTab === 'projects' && (
              <ProjectsPage
                onSelectProject={handleSelectProject}
                openDonateModal={handleOpenDonate}
                setCurrentTab={setCurrentTab}
              />
            )}
            {currentTab === 'needs' && <NeedsBoardPage openDonateModal={handleOpenDonate} />}
            {currentTab === 'transparency' && <TransparencyPage />}
            {currentTab === 'reputation' && <ReputationPage />}
            {currentTab === 'volunteers' && <VolunteersPage />}
            {currentTab === 'gallery' && <GalleryPage />}
            {currentTab === 'corporate' && <CorporatePortal />}
            {currentTab === 'about' && <AboutPage />}
            {currentTab === 'contact' && <ContactPage />}
            {currentTab === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedProject(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openDonateModal={() => handleOpenDonate()}
      />

      {/* Global Modals */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        defaultProjectId={donateDefaultProject}
      />
      <AIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppDataProvider>
            <MainAppContent />
          </AppDataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
