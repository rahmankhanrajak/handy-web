import './App.css'
import { Route, Routes } from 'react-router-dom'
import { lazy} from 'react'
import Layout from './Layout.tsx'
import Home from './components/pages/Home.tsx'
import OtpLogin from './components/pages/OtpLogin.tsx'
import PrivateLayout from './PrivateLayout.tsx'
import SelectService from './components/pages/SelectService.tsx'
import Cart from './components/pages/Cart.tsx'
import QrPage from './components/pages/QrPage.tsx'
import TransactionSuccess from './components/pages/TransactionSuccess.tsx'


const Dashboard = lazy(() => import("./components/pages/Dashboard.tsx"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<OtpLogin />} />
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/selectService" element={<SelectService />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/qrcode" element={<QrPage />} />
          <Route path="/transaction" element={<TransactionSuccess />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
