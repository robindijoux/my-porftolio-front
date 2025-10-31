import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { AuthComponent } from "./components/AuthComponent";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import CreateEvent from "./pages/CreateEvent";
import AdminEvents from "./pages/AdminEvents";
import AdminProjects from "./pages/AdminProjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { t } = useTranslation();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthComponent>
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route 
                    path="/create-project" 
                    element={
                      <ProtectedRoute 
                        title={t('errors.authRequired')}
                        description={t('errors.authRequiredDescription')}
                      >
                        <CreateProject />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/edit-project/:id" 
                    element={
                      <ProtectedRoute 
                        title={t('errors.authRequired')}
                        description={t('errors.authRequiredDescription')}
                      >
                        <EditProject />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/create-event" 
                    element={
                      <ProtectedRoute 
                        title={t('errors.authRequired')}
                        description={t('errors.authRequiredDescription')}
                      >
                        <CreateEvent />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/events" 
                    element={
                      <ProtectedRoute 
                        title={t('errors.authRequired')}
                        description={t('errors.authRequiredDescription')}
                      >
                        <AdminEvents />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/projects" 
                    element={
                      <ProtectedRoute 
                        title={t('errors.authRequired')}
                        description={t('errors.authRequiredDescription')}
                      >
                        <AdminProjects />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/project/:id" element={<ProjectDetail />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthComponent>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
