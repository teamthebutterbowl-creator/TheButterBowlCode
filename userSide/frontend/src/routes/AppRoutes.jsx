/**
 * All page URLs for the site live here.
 * Example: /auth opens the Login / Register page.
 */
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home/Home';
import Menu from '../pages/Menu/Menu';
import About from '../pages/About/About';
import Gallery from '../pages/Gallery/Gallery';
import Contact from '../pages/Contact/Contact';
import OrderOnline from '../pages/OrderOnline/OrderOnline';
import OrderTracking from '../pages/OrderTracking/OrderTracking';
import OrderConfirmation from '../pages/OrderConfirmation/OrderConfirmation';
import Checkout from '../pages/Checkout/Checkout';
import Profile from '../pages/Profile/Profile';
import StarRating from '../pages/Starrating/Starrating';
import ReviewSection from '../pages/ReviewSection/Reviewsection';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Auth from '../pages/Auth/Auth';
import MyOrders from "../pages/MyOrders/Myorders";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Menu />} />
          <Route path="menu" element={<Menu />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="order" element={<OrderOnline />} />
        <Route path="auth" element={<Auth />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="track" element={<OrderTracking />} />
        <Route path="order-confirmation" element={<OrderConfirmation/>}/>
        <Route path="checkout" element={<Checkout/>}/>
        <Route path="profile" element={<Profile />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="star-rating" element={<StarRating />} />
        <Route path="review-section" element={<ReviewSection/>}/>
        <Route path="menu/:id" element={<ProductDetail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}
