import React from "react";
import { Route, Routes } from "react-router-dom";
import ThemeProviderDefault from "./components/theme/ThemeProvider";
import MenuProvider from "./providers/MenuProvider";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cardapio from "./pages/menu/Menu";
import Orders from "./pages/orders/Orders";
import Sidebar from "./components/sidebar/Sidebar";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import WithAdminAccess from "./components/routes/WithAdminAccess";
import Reports from "./pages/reports/Reports";
import Store from "./pages/store/Store";
import StoreTabs from "./pages/store/StoreTabs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<ThemeProviderDefault />}>
          <Route element={<Sidebar />}>
            <Route path="/pedidos" element={<Orders />} />
            <Route element={<MenuProvider />}>
              <Route path="/cardapio" element={<Cardapio />} />
            </Route>
            </Route>
            <Route element={<WithAdminAccess />}>
            <Route element={<Sidebar />}>
              <Route path="/loja" element={<Store />}>
              <Route path="/loja/:tab" element={<StoreTabs />} />
              </Route>
              <Route path="/relatorios" element={<Reports />} />
            </Route>
            </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;