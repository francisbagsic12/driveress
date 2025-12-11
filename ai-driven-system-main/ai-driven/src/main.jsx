import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CustomMap from "./pages/CustomMap.jsx";
import AdminDirectLogin from "./pages/AdminDirectLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import Shelters from "./components/Shelters.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Incidents from "./components/Incidents.jsx";
import RescueTeams from "./components/RescueTeams.jsx";
import Resources from "./components/Resource.jsx";
import Reports from "./components/Report.jsx";
import ReportDetails from "./components/ReportDetails.jsx";
import Operations from "./components/Operartion.jsx";
import LiveMap from "./components/LiveMap.jsx";
const router = createBrowserRouter([
  { path: "/", element: <CustomMap /> },
  { path: "/adminLogin", element: <AdminDirectLogin /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "ai-assistant", element: <AIAssistant /> },
      { path: "shelters", element: <Shelters /> },
      { path: "incidents", element: <Incidents /> },
      { path: "rescue-teams", element: <RescueTeams /> },
      { path: "resources", element: <Resources /> },
      { path: "reports", element: <Reports /> },
      { path: "reports/:id", element: <ReportDetails /> },
      { path: "operations", element: <Operations /> },
      { path: "live-map", element: <LiveMap /> },

      // Add more child routes here
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
