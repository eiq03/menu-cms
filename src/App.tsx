import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "./components/layout/app-layout"
import { CategoryPage } from "./pages/categories/category-page"
import { ProductPage } from "./pages/products/product-page"
import { SpotPage } from "./pages/spots/spot-page"
import { GuestCheckPage } from "./pages/guest-checks/guest-check-page"
import { GuestCheckDetailPage } from "./pages/guest-checks/guest-check-detail-page"
import { OrderKanbanPage } from "./pages/orders/order-kanban-page"

function App() {

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/categories" />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="spots" element={<SpotPage />} />
        <Route path="guest-checks" element={<GuestCheckPage />} />
        <Route path="guest-checks/:id" element={<GuestCheckDetailPage />} />
        <Route path="orders" element={<OrderKanbanPage />} />
      </Route>
    </Routes>
  )
}

export default App
