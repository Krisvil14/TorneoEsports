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
import TeamsInterface from './component/interfaces/user/Teams';
import HomePage from './pages/start';
import 'react-toastify/dist/ReactToastify.css';
import Protected from './component/commons/Protected';
import RegTeamsForm from './component/teams/RegTeamsForm';
import UsersPage from './pages/users';
import TournamentsPage from './pages/tournaments';
import CreateTournamentForm from './component/interfaces/admin/tournaments/CreateTournamentForm';
import AddTeamToTournament from './component/interfaces/admin/tournaments/AddTeamToTournament';
import AddPlayerToTeam from './component/interfaces/admin/users/AddPlayerToTeam';
import CreateUserPage from './pages/admin/createUser';
import TeamInfo from './pages/teamInfo';
import TeamsAdminPage from './pages/admin/teams';
import UsersAdminInterface from './component/interfaces/admin/users/Users'
import TournamentsAdminPage from './pages/admin/tournaments';



// Crear tu primer componente
const Layout = () => {
    const basename = process.env.BASENAME || "";

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
              <Route element={<Protected> <HomePage /> </Protected>} path="/inicio" />
              <Route element={<Protected> <TeamsInterface /> </Protected>} path="/teams" />
              <Route element={<Protected> <RegTeamsForm /> </Protected>} path="/Regteams" />
              <Route element={<Protected> <UsersPage /> </Protected>} path="/users" />
              <Route element={<Protected> <TournamentsPage /> </Protected>} path="/tournaments" />
              <Route element={<Protected> <TeamInfo /> </Protected>} path="/teamInfo/:teamId" />
              <Route element={<Protected requiredRole="admin"> <CreateTournamentForm /> </Protected>} path="/admin/create_tournament" />
              <Route element={<Protected requiredRole="admin"> <AddTeamToTournament /> </Protected>} path="/admin/addteam/:tournament_id" />
              <Route element={<Protected requiredRole="admin"> <AddPlayerToTeam /> </Protected>} path="/admin/add_player_to_team/:user_id" />
              <Route element={<Protected requiredRole="admin"> <CreateUserPage /> </Protected>} path="/admin/create_user" />
              <Route element={<Protected requiredRole="admin"> <TeamsAdminPage /> </Protected>} path="/admin/teams" />
              <Route element={<Protected requiredRole="admin"> <UsersAdminInterface /> </Protected>} path="/admin/users" />
              <Route element={<Protected requiredRole="admin"> <TournamentsAdminPage /> </Protected>} path="/admin/tournaments" />


              <Route element={<h1>Not found!</h1>} />
            </Routes>
            <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
