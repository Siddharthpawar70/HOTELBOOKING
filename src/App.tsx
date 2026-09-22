import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import { BookingProvider } from './context/BookingContext';
import { AdminProvider } from './context/AdminContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { HotelSearchResultsPage } from './pages/customer/HotelSearchResultsPage';
import { HotelDetailsPage } from './pages/customer/HotelDetailsPage';
import { BookingCheckoutPage } from './pages/customer/BookingCheckoutPage';
import { PaymentPage } from './pages/customer/PaymentPage';
import { BookingConfirmationPage } from './pages/customer/BookingConfirmationPage';
import { MyTripsPage } from './pages/customer/MyTripsPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { UserProfilePage } from './pages/customer/UserProfilePage';
import { DestinationsPage } from './pages/customer/DestinationsPage';
import { CorporateStaysPage } from './pages/customer/CorporateStaysPage';
import { GroupBookingPage } from './pages/customer/GroupBookingPage';

// Admin Page
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Auto scroll-to-top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Layout wrapper to toggle footer on Admin vs Customer
function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelSearchResultsPage />} />
          <Route path="/hotel/:id" element={<HotelDetailsPage />} />
          <Route path="/checkout" element={<BookingCheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/confirmation/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/corporate" element={<CorporateStaysPage />} />
          <Route path="/group-booking" element={<GroupBookingPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          {/* Fallback to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
            <SearchProvider>
              <BookingProvider>
                <AdminProvider>
                  <ScrollToTop />
                  <AppLayout />
                </AdminProvider>
              </BookingProvider>
            </SearchProvider>
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
