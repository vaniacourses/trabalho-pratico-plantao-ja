import React from 'react'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignInGestorPage from './pages/SignInGestorPage';
import SignInMedicoPage from './pages/SignInMedicoPage';
import PrivateRoute from './pages/PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import './App.css'

const App: React.FC<{}> = () => {
  return (
      <BrowserRouter>
        {/* Navigation Bar */}
          <nav className="navbar">
            <ul className="nav-links">
              <li><Link to="/" className="logo">Plantão Já</Link></li>
              <li><a href="#home">Início</a></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#services">Serviços</a></li>
              <li><a href="#contact">Contato</a></li>
              <li id="login"><Link to="/login">Login</Link></li>
              <li id="signin-gestor"><Link to="/signin-gestor">Cadastro - Gestor</Link></li>
              <li id="signin-médico"><Link to="/signin-médico">Cadastro - Médico</Link></li>
            </ul>
          </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin-gestor" element={<SignInGestorPage />} />
          <Route path="/signin-médico" element={<SignInMedicoPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
  );
};

export default App;
