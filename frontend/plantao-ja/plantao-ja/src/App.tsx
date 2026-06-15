import React from 'react'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignInGestorPage from './pages/SignInGestorPage';
import SignInMedicoPage from './pages/SignInMedicoPage';
import PrivateRoute from './pages/PrivateRoute';
import DashboardPage from './pages/DashboardPage';
import SignInHospitalPage from './pages/SignInHospitalPage';
import './App.css'

const App: React.FC<{}> = () => {
  return (
    <>
      <BrowserRouter>
        {/* Navigation Bar */}
          <nav className="navbar">
            <ul className="nav-links">
              <li><Link to="/" className="logo">Plantão Já</Link></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#services">Serviços</a></li>
              <li><a href="#contact">Contato</a></li>
              <li id="login"><Link to="/login">Login</Link></li>
              <li className='dropdown-li'><a className="dropdown">Primeiro Aceso</a>
                <ul className="dropdown-content">
                  <li id="signin-gestor"><Link to="/signin-gestor" className="dp-link"><img src="./src/assets/businessman.png" alt=""/> Gestor</Link></li>
                  <li id="signin-médico"><Link to="/signin-médico" className="dp-link"><img src="./src/assets/medical-assistance.png" alt=""/>Médico</Link></li>
                </ul>
              </li>
            </ul>
          </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin-gestor" element={<SignInGestorPage />} />
          <Route path="/signin-médico" element={<SignInMedicoPage />} />
          <Route path="/signin-hospital" element={<SignInHospitalPage/>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
      <footer>
        <section><p>© 2026 Plantao Ja Todos os direitos reservados</p></section>
        <section>
            <a href="http://www.instagram.com"><img src="./src/assets/Instagram_Glyph_Gradient.png"></img></a>
            <a href="http://www.x.com"><img src="./src/assets/logo-black.png"></img></a>
        </section>
      </footer>
    </>
  );
};

export default App;
 // Cŕeditos:

 // ícones:

 /* <a href="https://www.flaticon.com/free-icons/businessman" title="businessman icons">Businessman icons created by Gregor Cresnar - Flaticon</a>*/
 // <a href="https://www.flaticon.com/free-icons/physician" title="physician icons">Physician icons created by tuktukdesign - Flaticon</a>