import { Route, Routes } from "react-router-dom";
import { portalRoutes } from "./PortalRoutes";
import { authRoutes } from "./AuthRoutes";
import { adminRoutes } from "./AdminRoutes";
import { mainRoutes } from "./MainRoutes";
import { NotFound, StatusPage } from "./lazyPages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/status" element={<StatusPage />} />
      {portalRoutes}
      {authRoutes}
      {adminRoutes}
      {mainRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
