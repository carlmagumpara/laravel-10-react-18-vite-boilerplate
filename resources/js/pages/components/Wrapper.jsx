import { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Navbar, NavDropdown, Collapse, Button, Badge } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaCut, FaUserPlus, FaClock, FaBullhorn, FaCalendarCheck, FaCalendar, FaInbox, FaHome, FaUsers, FaFile, FaUser, FaSignOutAlt, FaLock, FaBell, FaCog, FaPlus, FaMapMarked, FaBuilding, FaList, FaListOl } from 'react-icons/fa';
import { FaMoneyBill, FaMoneyBillTransfer  } from 'react-icons/fa6';
import { FaGears } from 'react-icons/fa6';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { RiRadioButtonLine } from 'react-icons/ri';
import logo from 'src/assets/logo.png';
import './Wrapper.scss';
import { confirm } from 'src/shared/confirm';
import Loader from 'src/shared/loader';
import { useAuth } from 'src/hooks/useAuth';
import { useGetNotificationCountQuery } from 'src/redux/services/notifications';
import { useGetUnreadConversationsQuery } from 'src/redux/services/conversations';

function useMessageCount() {
  const { data, error, isLoading, isFetching, refetch } = useGetUnreadConversationsQuery(undefined, { pollingInterval: 3000 });

  useEffect(() => {
    refetch();
  }, [])

  return data;
}

function useNotificationCount() {
  const { data, error, isLoading, isFetching, refetch } = useGetNotificationCountQuery(undefined, { pollingInterval: 3000 });

  useEffect(() => {
    refetch();
  }, [])

  return data;
}

function Sidebar() {
  const auth = useAuth();
  const [open, setOpen] = useState(true);
  const message_count = useMessageCount();
  const notification_count = useNotificationCount();

  return (
    <div className="w-100">
      <div className="mb-3">
        <img src={logo} className="w-100" />
        {/*<span className="ms-2 fw-bold">TRIX'S Salon</span>*/}
      </div>
      <Nav className="flex-column">
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/dashboard"><FaHome /> <span className="ms-2">Dashboard</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2 d-flex justify-content-between align-items-start" to="/notifications"><span><FaBell /> <span className="ms-2">Notifications</span></span> {notification_count ? <Badge bg="danger">{notification_count}</Badge> : null}</Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2 d-flex justify-content-between align-items-start" to="/messages"><span><FaInbox /> <span className="ms-2">Messages</span></span> {message_count ? <Badge bg="danger">{message_count}</Badge> : null}</Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/users/clients"><span><FaUsers /> <span className="ms-2">Clients</span></span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/appointments/list"><FaCalendarCheck /> <span className="ms-2">Appointments</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/services"><FaCut /> <span className="ms-2">Services</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/stylists"><FaUsers /> <span className="ms-2">Stylists</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/payments"><FaMoneyBill /> <span className="ms-2">Payments</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/announcements"><FaBullhorn /> <span className="ms-2">Announcements</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/stylist-positions"><FaUserPlus /> <span className="ms-2">Stylist Positions</span></Nav.Link>
        <Nav.Link as={Link} className="text-white fw-bold p-2" to="/history"><FaClock /> <span className="ms-2">History</span></Nav.Link>
      </Nav>
    </div>
  )
}

function Navigator({ open, setOpen }) {
  const auth = useAuth();

  return (
    <Navbar className="p-3 border-bottom" style={{ backgroundColor: '#fdeffa' }}>
      <Container fluid className="">
        <Button
          onClick={() => setOpen(!open)}
          variant="link"
          className="text-dark h3 p-0"
        >
          <h4 className="mb-0">
            {open ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          </h4>
        </Button>
        <h5 className="mb-0 ms-3">TRIX'S MOBILE APPOINTMENT MANAGEMENT SYSTEM</h5>
        <Navbar.Collapse className="justify-content-end">
          <NavDropdown title={<span className="text-dark">Signed in as: {`${auth.getName}`} <img src={auth.getAvatar} width="30" height="30" style={{ objectFit: 'cover' }} className="rounded-circle ms-2" /></span>} id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/profile">
              <FaUser /> Update Profile
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/change-password">
              <FaLock /> Change Password
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={async () => {
                if (await confirm({ title: 'Logout', confirmation: 'Are you sure you want to logout?' })) {
                  await auth.logout();
                }
              }}
            >
              <FaSignOutAlt /> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function Wrapper() {
  const [open, setOpen] = useState(true);

  return (
    <Container fluid>
      <div className="row flex-nowrap">
        {open ? (
          <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{ backgroundColor: '#f793e7' }}>
            <div className="d-flex flex-column align-items-center align-items-sm-start pt-2 text-white min-vh-100">
              <Sidebar />
            </div>
          </div>
        ) : null}
        <div className="col p-0">
          <Navigator open={open} setOpen={setOpen} />
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Wrapper;