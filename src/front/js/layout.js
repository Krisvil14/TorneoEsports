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
import TeamsInterface from './component/interfaces/Teams';
import HomePage from './pages/start';
import 'react-toastify/dist/ReactToastify.css';
import Protected from './component/commons/Protected';
import RegTeamsForm from './component/teams/RegTeamsForm';
import UsersPage from './pages/users';
import TournamentsPage from './pages/tournaments';
import CreateTournamentForm from './component/tournaments/CreateTournamentForm';
import AddTeamToTournament from './component/tournaments/AddTeamToTournament';


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
              <Route element={<Protected> <HomePage /> </Protected> } path="/inicio" />
              <Route element={<Protected> <TeamsInterface /> </Protected> } path="/teams" />
              <Route element={<Protected> <RegTeamsForm /> </Protected> } path="/Regteams" />
              <Route element={<Protected> <UsersPage /> </Protected>} path="/users" />
              <Route element={<Protected> <TournamentsPage /> </Protected>} path="/tournaments" />
              <Route element={<Protected> <CreateTournamentForm /> </Protected>} path="/Cretournament" />
              <Route element={<Protected> <AddTeamToTournament /> </Protected>} path="/addteam/:tournament_id" />

              <Route element={<h1>Not found!</h1>} />
            </Routes>
            <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
