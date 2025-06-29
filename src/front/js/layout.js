import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from './component/scrollToTop';
import { BackendURL } from './component/backendURL';
import { Home } from './pages/home';
import { Demo } from './pages/demo';
import { Single } from './pages/single';
import { Navbar } from './component/navbar';
import injectContext from './store/appContext';
import EmailVerification from './component/login/EmailVerification';
import TeamsInterface from './component/interfaces/user/Teams';
import HomePage from './pages/start';
import Landing from './pages/landing';
import 'react-toastify/dist/ReactToastify.css';
import Protected from './component/commons/Protected';
import RegTeamsForm from './component/teams/RegTeamsForm';
import ProfilePage from './pages/profile';
import TournamentsPage from './pages/tournaments';
import TournamentRulesPage from './pages/tournamentRules';
import CreateTournamentForm from './component/interfaces/admin/tournaments/CreateTournamentForm';
import AddTeamToTournament from './component/interfaces/admin/tournaments/AddTeamToTournament';
import AddPlayerToTeam from './component/interfaces/admin/users/AddPlayerToTeam';
import CreateUserPage from './pages/admin/createUser';
import TeamInfo from './pages/teamInfo';
import TeamsAdminPage from './pages/admin/teams';
import UsersAdminInterface from './component/interfaces/admin/users/Users';
import TournamentsAdminPage from './pages/admin/tournaments';
import EditProfilePage from './pages/editProfile';
import CreateTeamForm from './component/teams/CreateTeamForm';
import BuscaEquipo from './pages/BuscaEquipo';
import TeamInfoUser from './pages/teamInfoUser';
import TournamentRequests from './component/interfaces/admin/tournaments/TournamentRequests';
import MakePaymentsPage from './pages/makepayments';
import PaymentsPage from './pages/payments';
import RecievePaymentsPage from './pages/receivepayments';
import TeamInfoAdmin from './pages/admin/teamInfoAdmin';
import PaymentsAdmin from './pages/admin/payments';
import EditUserForm from './component/interfaces/admin/users/EditUserForm';
import RankingInterface from './component/interfaces/user/Ranking';
import LoginForm from './component/login/LoginForm';
import RegisterForm from './component/login/RegisterForm';
import ResetPasswordRequest from './component/login/ResetPasswordRequest';
import ResetPasswordVerify from './component/login/ResetPasswordVerify';
import InactivityWarning from './component/commons/InactivityWarning';
import AdminCreateTeamPage from './pages/admin/createTeam';


// Crear tu primer componente
const Layout = () => {
  const basename = process.env.BASENAME || '';

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === '')
    return <BackendURL />;

  return (
    <div>
      <ToastContainer />
      <InactivityWarning />
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Routes>
            <Route element={<Landing />} path="/" />
            <Route element={<Single />} path="/single/:theid" />
            <Route element={<LoginForm />} path="/login" />
            <Route element={<RegisterForm />} path="/register" />
            <Route element={<ResetPasswordRequest />} path="/reset-password" />
            <Route element={<ResetPasswordVerify />} path="/verify-reset-otp" />
            <Route element={<EmailVerification />} path="/verify-email" />

            <Route element={<Protected> <Navbar /><HomePage /> </Protected>}path="/inicio" />
            <Route element={<Protected> <Navbar /><TeamsInterface /> </Protected>}path="/teams" />
            <Route element={<Protected> <Navbar /><ProfilePage /> </Protected>}path="/profile" />
            <Route element={<Protected> <Navbar /><EditProfilePage /> </Protected>}path="/editProfile" />
            <Route element={<Protected> <Navbar /><TournamentsPage /> </Protected>}path="/tournaments" />
            <Route element={<Protected> <Navbar /><TournamentRulesPage /> </Protected>}path="/tournament-rules/:tournamentId" />
            <Route element={<Protected> <Navbar /><TeamInfoUser /> </Protected>}path="/busca-equipo/:teamId" />
            <Route element={<Protected> <Navbar /><TeamInfo /> </Protected>}path="/teamInfo/:teamId" />
            <Route element={<Protected> <Navbar /><PaymentsPage /> </Protected>}path="/payments" />
            <Route element={<Protected> <Navbar /><MakePaymentsPage /> </Protected>}path="/make-payments" />
            <Route element={<Protected> <Navbar /><RecievePaymentsPage /> </Protected>}path="/receive-payments" />
            <Route element={<Protected> <Navbar /><CreateTeamForm /> </Protected>}path="/create-team" />
            <Route element={<Protected> <Navbar /><BuscaEquipo /> </Protected>}path="/busca-equipo" />
            <Route element={<Protected> <Navbar /><RankingInterface /> </Protected>}path="/ranking" />

            <Route element={<Protected requiredRole="admin"> <Navbar /><TeamInfoAdmin /> </Protected>}path="/admin/teamInfo/:teamId" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><AdminCreateTeamPage /> </Protected>}path="/admin/create-team" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><CreateTournamentForm /> </Protected>}path="/admin/create_tournament" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><AddTeamToTournament /> </Protected>}path="/admin/addteam/:tournament_id" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><AddPlayerToTeam /> </Protected>}path="/admin/add_player_to_team/:user_id" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><CreateUserPage /> </Protected>}path="/admin/create_user" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><TeamsAdminPage /> </Protected>}path="/admin/teams" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><UsersAdminInterface /> </Protected>}path="/admin/users" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><EditUserForm /> </Protected>}path="/admin/edit_user/:userId" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><TournamentsAdminPage /> </Protected>}path="/admin/tournaments" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><TournamentRequests /> </Protected>}path="/admin/tournament-requests/:tournamentId" />
            <Route element={<Protected requiredRole="admin"> <Navbar /><PaymentsAdmin /> </Protected>}path="/admin/payments" />

            <Route element={<h1>Not found!</h1>} path="*" />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
