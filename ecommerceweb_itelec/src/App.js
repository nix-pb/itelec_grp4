import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Starting from './Pages/Starting';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import ProductListAdmin from './Pages/ProductListAdmin';
import ProductListCustomer from './Pages/ProductListCustomer';
import ProductDetails from './Components/ProductDetails';
import Orders from './Pages/Orders';
import CartList from './Pages/CartList';
import AdminAddProduct from './Pages/AdminAddProduct';
import AdminHome from './Pages/AdminHome';
import AccountProfile from './Pages/AccountProfile';
import EditProduct from './Pages/EditProduct';
import BuyerRegister from './Pages/a_BuyerRegister';
import SellerRegister from './Pages/a_SellerRegister';
import AccountType from './Pages/AccountType';
import Confirmation from './Pages/ProductListAdmin/Confirmation';
import Chat from './Pages/Chat';
import OrderForm from './Pages/OrderForm';
import OrdersList from './Pages/OrdersList';
import Shop from './Pages/Shop';



function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Starting />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/BuyerRegister" element={<BuyerRegister />} />
          <Route path="/SellerRegister" element={<SellerRegister />} />
          <Route path="/AccountType" element={<AccountType />} />
          <Route path="/Home" element={<Home />} />
          <Route path='/ProductListAdmin' element={<ProductListAdmin />} />
          <Route path='/ProductListCustomer' element={<ProductListCustomer />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/CartList" element={<CartList />} />
          <Route path="/AdminAddProduct" element={<AdminAddProduct />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/AccountProfile" element={<AccountProfile />} />
          <Route path="/EditProduct/:id" element={<EditProduct />} />
          <Route path="/Confirmation" element={<Confirmation />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/OrderForm" element={<OrderForm />} />
          <Route path="/OrdersList" element={<OrdersList />} />
          <Route path="/shop" element={<Shop />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;
