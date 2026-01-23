import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import TeacherLogin from "./pages/TeacherLogin";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageMaterials from "./pages/admin/ManageMaterials";
import ManagePYQs from "./pages/admin/ManagePYQs";
import ManageClassrooms from "./pages/admin/ManageClassrooms";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import FreePeriods from "./pages/FreePeriods";
import Classrooms from "./pages/Classrooms";
import Professors from "./pages/Professors";
import StudyMaterials from "./pages/StudyMaterials";
import PreviousYearQuestions from "./pages/PreviousYearQuestions";
import TopicHeatmap from "./pages/TopicHeatmap";
import NotFound from "./pages/NotFound";
import { PageTransition } from "./components/PageTransition";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />
          <Route path="/teacher-login" element={<PageTransition><TeacherLogin /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/update-password" element={<PageTransition><UpdatePassword /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><DashboardLayout /></PageTransition>}>
            <Route index element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="timetable" element={<PageTransition><Timetable /></PageTransition>} />
            <Route path="free-periods" element={<PageTransition><FreePeriods /></PageTransition>} />
            <Route path="classrooms" element={<PageTransition><Classrooms /></PageTransition>} />
            <Route path="professors" element={<PageTransition><Professors /></PageTransition>} />
            <Route path="materials" element={<PageTransition><StudyMaterials /></PageTransition>} />
            <Route path="pyq" element={<PageTransition><PreviousYearQuestions /></PageTransition>} />
            <Route path="heatmap" element={<PageTransition><TopicHeatmap /></PageTransition>} />
          </Route>

          <Route path="/admin" element={<PageTransition><AdminLayout /></PageTransition>}>
            <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="users" element={<PageTransition><ManageUsers /></PageTransition>} />
            <Route path="materials" element={<PageTransition><ManageMaterials /></PageTransition>} />
            <Route path="pyqs" element={<PageTransition><ManagePYQs /></PageTransition>} />
            <Route path="classrooms" element={<PageTransition><ManageClassrooms /></PageTransition>} />
          </Route>
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
