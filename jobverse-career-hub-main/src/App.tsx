import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeGenerator from "./pages/ResumeGenerator";
import ResumeChecker from "./pages/ResumeChecker";
import InterviewCoach from "./pages/InterviewCoach";
import InterviewQuestions from "./pages/InterviewQuestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="resume-generator" element={<ResumeGenerator />} />
            <Route path="resume-checker" element={<ResumeChecker />} />
            <Route path="interview-coach" element={<InterviewCoach />} />
            <Route path="questions" element={<InterviewQuestions />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
