import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import HomePage from "./pages/HomePage";
import { Visit_Hook } from "./hooks/visit";
import ApartmentDetailPage from "./pages/ApartmentDetailPage";
import AddApartmentPage from "./pages/AddApartmentPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Edit_Apartment_Page from "./pages/Edit_Apartment";
export function App() {
  Visit_Hook();
  return (
    <Provider store={store}>
      <div
        className="flex flex-col min-h-screen font-arabic bg-white"
        dir="rtl"
      >
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apartment/:_id" element={<ApartmentDetailPage />} />
            <Route path="/add-apartment" element={<AddApartmentPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/editapartment/:_id"
              element={<Edit_Apartment_Page />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Provider>
  );
}
