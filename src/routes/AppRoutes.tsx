import { Route, Routes } from "react-router-dom";
import { portalRoutes } from "./PortalRoutes";
import { authRoutes } from "./AuthRoutes";
import { adminRoutes } from "./AdminRoutes";
import { mainRoutes } from "./MainRoutes";
import { NotFound } from "./lazyPages";

export function AppRoutes() {
  return (
    <Routes>
      {portalRoutes}
      {authRoutes}
      {adminRoutes}
      {mainRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
