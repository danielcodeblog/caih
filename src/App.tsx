import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { PageId, Project, Article, VideoDispatch } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SeoManager } from './components/SeoManager';
import { HomeScreen } from './screens/HomeScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { BlogScreen } from './screens/BlogScreen';
import { AboutScreen } from './screens/AboutScreen';
import { ProjectDetailScreen } from './screens/ProjectDetailScreen';
import { VideoDetailScreen } from './screens/VideoDetailScreen';
import { RealtorRegistrationScreen } from './screens/RealtorRegistrationScreen';
import { ContactScreen } from './screens/ContactScreen';
import { AdminScreen } from './screens/AdminScreen';
import { WebmailRedirect } from './components/WebmailRedirect';
import { VIDEO_DISPATCHES, PROJECTS as MOCK_PROJECTS } from './data/mockData';
import { fetchPropertiesFromSupabase, fetchArticlesFromSupabase, isSupabaseConfigured } from './lib/supabase';
import { getStoredProjects, saveStoredProjects } from './utils/projectsStore';
import { getStoredArticles, saveStoredArticles } from './utils/articlesStore';

function ProjectDetailWrapper({
  projects,
  onNavigate,
  onBookInspection
}: {
  projects: Project[];
  onNavigate: (page: PageId) => void;
  onBookInspection: (target?: string) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project =
    projects.find((p) => p.id === id) ||
    projects.find((p) => p.specs?.units?.toString() === id) ||
    projects.find((p) => id?.startsWith(p.id) || p.id.startsWith(id || '')) ||
    projects[0] ||
    MOCK_PROJECTS[0];

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
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = getStoredProjects();
    return Array.isArray(stored) ? stored : [];
  });
  const [articles, setArticles] = useState<Article[]>(() => {
    const stored = getStoredArticles();
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    // Listen for custom store update events triggered by Admin or client actions
    const handleProjectsUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProjects(e.detail);
      }
    };
    const handleArticlesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setArticles(e.detail);
      }
    };

    window.addEventListener('caih_projects_updated', handleProjectsUpdated);
    window.addEventListener('caih_articles_updated', handleArticlesUpdated);

    // Initial load from Supabase if configured
    const loadRemoteData = async () => {
      if (isSupabaseConfigured()) {
        try {
          const [fetchedProps, fetchedArticles] = await Promise.all([
            fetchPropertiesFromSupabase(),
            fetchArticlesFromSupabase()
          ]);
          if (fetchedProps && fetchedProps.length > 0) {
            setProjects(fetchedProps);
            saveStoredProjects(fetchedProps);
          }
          if (fetchedArticles && fetchedArticles.length > 0) {
            setArticles(fetchedArticles);
            saveStoredArticles(fetchedArticles);
          }
        } catch (err) {
          console.warn('Initial remote load note:', err);
        }
      }
    };
    loadRemoteData();

    window.addEventListener('caih_supabase_config_changed', loadRemoteData);

    return () => {
      window.removeEventListener('caih_projects_updated', handleProjectsUpdated);
      window.removeEventListener('caih_articles_updated', handleArticlesUpdated);
      window.removeEventListener('caih_supabase_config_changed', loadRemoteData);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine currentPage for Header/Footer highlighting
  const getPageIdFromPath = (pathname: string): PageId => {
    if (pathname.startsWith('/projects/')) return 'project-detail';
    if (pathname === '/projects') return 'projects';
    if (pathname.startsWith('/video/')) return 'video-detail';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname === '/about-us') return 'about-us';
    if (pathname === '/realtor-registration') return 'realtor-registration';
    if (pathname === '/contact') return 'contact';
    if (pathname.startsWith('/admin') || pathname === '/login' || pathname === '/signup') return 'admin';
    return 'home';
  };

  const currentPage = getPageIdFromPath(location.pathname);

  const [inspectionTargetProject, setInspectionTargetProject] = useState<string>(
    'Appleton Enclave (Idera)'
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
      case 'contact':
        navigate('/contact');
        break;
      case 'admin':
        navigate('/admin');
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
      navigate(`/contact?project=${encodeURIComponent(target)}`);
    } else {
      navigate('/contact');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    navigate(`/blog/${art.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] selection:bg-[#b7102a] selection:text-white">
      <SeoManager />
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
                projects={projects}
                articles={articles}
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
                projects={projects}
                onViewProject={handleViewProject}
                onBookInspection={handleOpenInspectionBooking}
                selectedProjectForInspection={inspectionTargetProject}
                initialFilter={projectsFilter}
              />
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProjectDetailWrapper
                projects={projects}
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
                articles={articles}
                onViewVideo={handleViewVideo}
                onNavigateToProjects={() => navigate('/projects')}
                onBookInspection={handleOpenInspectionBooking}
              />
            }
          />
          <Route
            path="/blog/:id"
            element={
              <BlogScreen
                articles={articles}
                onViewVideo={handleViewVideo}
                onNavigateToProjects={() => navigate('/projects')}
                onBookInspection={handleOpenInspectionBooking}
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
          <Route
            path="/contact"
            element={
              <ContactScreen
                initialProject={inspectionTargetProject}
                onNavigateToProjects={() => navigate('/projects')}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminScreen
                projects={projects}
                articles={articles}
                onViewProject={handleViewProject}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/admin/login"
            element={
              <AdminScreen
                projects={projects}
                articles={articles}
                initialMode="login"
                forceAuthScreen={true}
                onViewProject={handleViewProject}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/admin/signup"
            element={
              <AdminScreen
                projects={projects}
                articles={articles}
                initialMode="signup"
                forceAuthScreen={true}
                onViewProject={handleViewProject}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/login"
            element={
              <AdminScreen
                projects={projects}
                articles={articles}
                initialMode="login"
                forceAuthScreen={true}
                onViewProject={handleViewProject}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <AdminScreen
                projects={projects}
                articles={articles}
                initialMode="signup"
                forceAuthScreen={true}
                onViewProject={handleViewProject}
                onNavigate={handleNavigate}
              />
            }
          />
          <Route path="/webmail" element={<WebmailRedirect />} />
          <Route path="/webmail/*" element={<WebmailRedirect />} />
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
