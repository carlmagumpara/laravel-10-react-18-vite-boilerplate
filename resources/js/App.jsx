import { Routes, Route } from 'react-router-dom';

// Middleware
import PrivateRoute from 'src/pages/components/PrivateRoute';
import GuestRoute from 'src/pages/components/GuestRoute';

// Wrapper
import Wrapper from 'src/pages/components/Wrapper';

// Pages
import NotFound from 'src/pages/not-found';
import Landing from 'src/pages/landing';
import Login from 'src/pages/login';
import ResetPassword from 'src/pages/reset-password';
import Dashboard from 'src/pages/dashboard';
import Notifications from 'src/pages/notifications';
import Messages from 'src/pages/messages';

import Appointments from 'src/pages/appointments';
import Calendar from 'src/pages/appointments/calendar';
import Services from 'src/pages/services';
import Stylists from 'src/pages/stylists';
import Announcements from 'src/pages/announcements';
import History from 'src/pages/history';
import Payments from 'src/pages/payments';
import StylistPositions from 'src/pages/stylist-positions';

import Users from 'src/pages/users';
import Profile from 'src/pages/profile';
import ChangePassword from 'src/pages/change-password';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='*' element={<NotFound />} />
        {/*Authenticated Users*/}
        <Route element={<PrivateRoute />}>
          <Route element={<Wrapper />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages">
              <Route path=":conversation_id" element={<Messages />} />
              <Route path="" element={<Messages />} />
            </Route>
            <Route path="calendar" element={<Calendar />} />
            <Route path="users">
              <Route path="admins" element={<Users key="admin" role="admin" roleId="1" />} />
              <Route path="clients" element={<Users key="clients" role="client" roleId="2" />} />
            </Route>
            <Route path="appointments">
              <Route path="list" element={<Appointments />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>
            <Route path="services" element={<Services />} />
            <Route path="stylists" element={<Stylists />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="payments" element={<Payments />} />
            <Route path="stylist-positions" element={<StylistPositions />} />
            <Route path="history" element={<History />} />
            <Route path="users">
              <Route path="admins" element={<Users key="admin" role="admin" roleId="1" />} />
              <Route path="clients" element={<Users key="clients" role="client" roleId="2" />} />
            </Route>
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
        {/*Guest*/}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  );
}

export default App;
