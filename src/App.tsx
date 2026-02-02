import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout.tsx'
import Home from './components/pages/Home.tsx'
import OtpLogin from './components/pages/OtpLogin.tsx'
import Products from './components/pages/Products.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<OtpLogin />} />
        <Route path="products" element={<Products />} />
      </Route>
    </Routes>
  )
}

export default App
