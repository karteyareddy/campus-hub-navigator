import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import FreePeriods from "./pages/FreePeriods";
import Classrooms from "./pages/Classrooms";
import Professors from "./pages/Professors";
import StudyMaterials from "./pages/StudyMaterials";
import PreviousYearQuestions from "./pages/PreviousYearQuestions";
import TopicHeatmap from "./pages/TopicHeatmap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="free-periods" element={<FreePeriods />} />
            <Route path="classrooms" element={<Classrooms />} />
            <Route path="professors" element={<Professors />} />
            <Route path="materials" element={<StudyMaterials />} />
            <Route path="pyq" element={<PreviousYearQuestions />} />
            <Route path="heatmap" element={<TopicHeatmap />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
