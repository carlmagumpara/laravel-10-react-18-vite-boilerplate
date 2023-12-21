import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Table, InputGroup, Nav } from 'react-bootstrap';
import { useGetAppointmentServicesQuery } from 'src/redux/services/appointments';
import { FaSync, FaSearch, FaPrint } from 'react-icons/fa';
import { confirm } from '../../shared/confirm';
import Loader from 'src/shared/loader';
import { useAntMessage } from 'src/context/ant-message';
import { TailSpin } from  'react-loader-spinner';
import Pagination from 'src/shared/pagination';
import { moneyFormat } from 'src/helpers/utils';
import * as Yup from 'yup';
import moment from 'moment';
import { useGetStylistsQuery } from 'src/redux/services/stylists';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import logo from 'src/assets/logo.png';

function Stylists({ type = 'positions', serviceId = '', ...props }) {
  const { data, error, isLoading, isFetching, refetch } = useGetStylistsQuery ({
    search: '',
    page: 1,
    per_page: 1000,
  });

  return (
    <Form.Select
      {...props}
    >
      <option value="">All</option>
       {(data?.data || []).map(item => <option value={item.id}>{item.first_name}</option>)}
    </Form.Select>
  )
}

function Index() {
  const ref = useRef(null);
  const antMessage = useAntMessage();
  const [type, setType] = useState('');
  const [stylist_id, setStylistId] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const { data, error, isLoading, isFetching, refetch } = useGetAppointmentServicesQuery({
    type, 
    stylist_id, 
    start_date, 
    end_date,
    search: '',
    page: 1,
    per_page: (!type && !stylist_id && !start_date && !end_date) ? 10 : 100000,
  });

  useEffect(() => {
    refetch();
  }, [type, stylist_id, start_date, end_date]);

  return (
    <>
      <Container>
        <h2 className="mb-3">History</h2>
        <ReactToPrint
          content={() => ref.current}
        >
          <Card className="rounded-0">
            <Card.Body>
              <div className="d-flex justify-content-end align-items-center mb-3 mt-3 gap-3">
                <InputGroup>
                  <InputGroup.Text>
                    Schedule
                  </InputGroup.Text>
                  <Form.Select
                    value={type}
                    onChange={event => setType(event.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Booked">Booked</option>
                    <option value="Walk-in">Walk-in</option>
                  </Form.Select>
                </InputGroup>
                <InputGroup >
                  <InputGroup.Text>
                    Stylist
                  </InputGroup.Text>
                  <Stylists
                    value={stylist_id}
                    onChange={event => setStylistId(event.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text id="basic-addon1">Start Date</InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="start_date"
                    placeholder="Start Date"
                    value={start_date}
                    onChange={event => setStartDate(event.target.value)}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>End Date</InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="end_date"
                    placeholder="End Date"
                    value={end_date}
                    onChange={event => setEndDate(event.target.value)}
                  />
                </InputGroup>
                <Button 
                  variant="success" 
                  onClick={() => {
                    setType('');
                    setStylistId('');
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  Reset
                </Button>
                <PrintContextConsumer>
                  {({ handlePrint }) => (
                    <Button style={{ width: '50%' }} variant="success" type="submit" onClick={handlePrint}>
                      <FaPrint /> Print
                    </Button>
                  )}
                </PrintContextConsumer> 
              </div>
              {error ? (
                <p>Oh no, there was an error</p>
              ) : (isLoading || isFetching) ? (
                <Loader />
              ) : data ? (
                <div ref={ref}>
                  <div className="onlyPrint">
                    <div ref={ref}>
                      <div  className="ps-3 pe-3 mt-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex justify-content-start align-items-center">
                            <img
                              src={logo}
                              width="150"
                              className="d-inline-block align-top me-3"
                              alt="React Bootstrap logo"
                            />
                            <div>
                              <h4>TRIX'S SALON</h4>
                            </div>
                          </div>
                          <div>
                            <p className="mb-0">From: {start_date}</p>
                            <p className="mb-0">To: {end_date}</p>
                          </div>
                        </div>
                      </div>                
                    </div>
                  </div>
                  <div className="mt-3">
                    <Table borderless hover responsive className="admin-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Schedule</th>
                          <th>Client's Name</th>
                          <th>Service</th>
                          <th>Stylist Name</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map(item => (
                          <tr>
                            <td>{item.appointment.id}</td>
                            <td>{item.appointment.schedule_formatted}</td>
                            <td>{item.appointment.name ? item.appointment.name : '[Deleted User]'}</td>
                            <td>{item.service.name}</td>
                            <td>{item.stylist.first_name}</td>
                            <td>{item.appointment.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>                
              ) : null}
             </Card.Body>
          </Card>
        </ReactToPrint>
      </Container>
    </>
  );
}

export default Index;