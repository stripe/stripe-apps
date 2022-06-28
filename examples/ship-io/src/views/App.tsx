import { MemoryRouter, Routes, Route } from "react-router-dom";

import { LoginProvider } from "../hooks/LoginState";

import HomeView from "./HomeView";
import ProductsView from "./ProductsView";
import ShipmentView from "./ShipmentView";

const App = () => {
  return (
    <LoginProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="products" element={<ProductsView />} />
          <Route path="shipment" element={<ShipmentView />} />
        </Routes>
      </MemoryRouter>
    </LoginProvider>
  );
};

export default App;
