import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardShell } from "./layout/DashboardShell";
import { DashboardOverviewPage } from "../features/overview/DashboardOverviewPage";
import { PortfolioPage } from "../features/portfolio/PortfolioPage";
import { MarketsPage } from "../features/markets/MarketsPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { UiGalleryPage } from "../features/ui-gallery/UiGalleryPage";

export const App = () => (
  <Routes>
    <Route element={<DashboardShell />}>
      <Route index element={<DashboardOverviewPage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="markets" element={<MarketsPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
    <Route path="/ui" element={<UiGalleryPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
