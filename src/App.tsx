import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { PageId, Project, Article, VideoDispatch } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './screens/HomeScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { BlogScreen } from './screens/BlogScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ProjectDetailScreen } from './screens/ProjectDetailScreen';
import { VideoDetailScreen } from './screens/VideoDetailScreen';
import { RealtorRegistrationScreen } from './screens/RealtorRegistrationScreen';
import { PROJECTS, VIDEO_DISPATCHES } from './data/mockData';

// Helper component for Project Detail Route
function ProjectDetailWrapper({ onNavigate, onBookInspection }: { onNavigate: (page: PageId) => void; onBookInspection: (target?: string) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.id === id) || PROJECTS[0];

  return (
    <ProjectDetailScreen
      project={project}
      onBack={() => navigate('/projects')}
      onSelectProject={(proj) => navigate(`/projects/${proj.id}`)}
      onBookInspection={onBookInspection}
      onNavigate={onNavigate}
    />
  );
}

// Helper component for Video Detail Route
function VideoDetailWrapper({ onNavigate, onBookInspection, onSelectProject }: { onNavigate: (page: PageId) => void; onBookInspection: (target?: string) => void; onSelectProject: (proj: Project) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const video = VIDEO_DISPATCHES.find((v) => v.id === id) || VIDEO_DISPATCHES[0];

  return (
    <VideoDetailScreen
      video={video}
      onBack={() => navigate('/')}
      onSelectVideo={(vid) => navigate(`/video/${vid.id}`)}
      onSelectProject={onSelectProject}
      onBookInspection={onBookInspection}
      onNavigate={onNavigate}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine currentPage for Header/Footer highlighting
  const getPageIdFromPath = (pathname: string): PageId => {
    if (pathname.startsWith('/projects/')) return 'project-detail';
    if (pathname === '/projects') return 'projects';
    if (pathname.startsWith('/video/')) return 'video-detail';
    if (pathname === '/blog') return 'blog';
    if (pathname === '/about-us') return 'about-us';
    if (pathname === '/realtor-registration') return 'realtor-registration';
    return 'home';
  };

  const currentPage = getPageIdFromPath(location.pathname);

  const [inspectionTargetProject, setInspectionTargetProject] = useState<string>(
    'Appleton Enclave Phase I & II (Lekki Phase 2)'
  );
  const [projectsFilter, setProjectsFilter] = useState({
    keyword: '',
    type: 'ALL TYPES',
    location: 'ALL LOCATIONS',
    beds: 'ANY'
  });

  const handleHeroSearchSubmit = (filters: { keyword: string; type: string; location: string; beds: string }) => {
    setProjectsFilter(filters);
    navigate('/projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageId) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'projects':
        navigate('/projects');
        break;
      case 'blog':
        navigate('/blog');
        break;
      case 'about-us':
        navigate('/about-us');
        break;
      case 'realtor-registration':
        navigate('/realtor-registration');
        break;
      default:
        navigate('/');
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInspectionBooking = (target?: string) => {
    if (target) {
      setInspectionTargetProject(target);
    }
    if (location.pathname.startsWith('/projects/')) {
      const el = document.getElementById('project-inspection-anchor') || document.getElementById('inspection-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    navigate('/projects');
    setTimeout(() => {
      const el = document.getElementById('inspection-form-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleViewProject = (proj: Project) => {
    navigate(`/projects/${proj.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewVideo = (vid: VideoDispatch) => {
    navigate(`/video/${vid.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewArticle = (art: Article) => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] selection:bg-[#b7102a] selection:text-white">
      {/* Sticky Clean Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenInspection={() => handleOpenInspectionBooking()}
      />

      {/* Main Content Area with Web Routing */}
      <main className="flex-1 pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                onNavigate={handleNavigate}
                onViewProject={handleViewProject}
                onViewArticle={handleViewArticle}
                onViewVideo={handleViewVideo}
                onBookInspection={handleOpenInspectionBooking}
                onSearchSubmit={handleHeroSearchSubmit}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectsScreen
                onViewProject={handleViewProject}
                selectedProjectForInspection={inspectionTargetProject}
                initialFilter={projectsFilter}
              />
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProjectDetailWrapper
                onNavigate={handleNavigate}
                onBookInspection={handleOpenInspectionBooking}
              />
            }
          />
          <Route
            path="/video/:id"
            element={
              <VideoDetailWrapper
                onNavigate={handleNavigate}
                onBookInspection={handleOpenInspectionBooking}
                onSelectProject={handleViewProject}
              />
            }
          />
          <Route
            path="/blog"
            element={
              <BlogScreen
                selectedArticleId={null}
                onSelectArticle={() => {}}
                onViewVideo={handleViewVideo}
                onNavigateToProjects={() => navigate('/projects')}
              />
            }
          />
          <Route
            path="/about-us"
            element={
              <AboutScreen
                onContactDesk={() => handleOpenInspectionBooking()}
                onNavigateToProjects={() => navigate('/projects')}
              />
            }
          />
          <Route
            path="/realtor-registration"
            element={
              <RealtorRegistrationScreen
                onNavigateToProjects={() => navigate('/projects')}
                onBookInspection={() => handleOpenInspectionBooking()}
              />
            }
          />
        </Routes>
      </main>

      {/* Unified Corporate Navy Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => handleOpenInspectionBooking()}
      />
    </div>
  );
}
