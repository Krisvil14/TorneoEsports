import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from './component/scrollToTop';
import { BackendURL } from './component/backendURL';
import { Home } from './pages/home';
import { Demo } from './pages/demo';
import { Single } from './pages/single';
import { Navbar } from './component/navbar';
import { Footer } from './component/footer';
import injectContext from './store/appContext';
import Register from './pages/register';
import Login from './pages/login';
import Recovery from './pages/recovery';
import HomePage from './pages/start';
import 'react-toastify/dist/ReactToastify.css';

// Crear tu primer componente
const Layout = () => {
  const basename = process.env.BASENAME || '';

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === '')
    return <BackendURL />;

  return (
    <div>
      <ToastContainer />
      <BrowserRouter basename={basename}>
        <ScrollToTop>
            <Navbar />
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Demo />} path="/demo" />
              <Route element={<Single />} path="/single/:theid" />
              <Route element={<Register />} path="/registrar" />
              <Route element={<Login />} path="/login" />
              <Route element={<Recovery />} path="/recuperar" />
              <Route element={<HomePage />} path="/inicio" />
              <Route element={<h1>Not found!</h1>} />
            </Routes>
            <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);