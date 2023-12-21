import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Table, InputGroup, Nav } from 'react-bootstrap';
import { useGetAppointmentsQuery } from 'src/redux/services/appointments';
import { Verified, Done, Create, Edit, Delete } from './Actions';
import { FaSync, FaSearch } from 'react-icons/fa';
import { confirm } from '../../shared/confirm';
import Loader from 'src/shared/loader';
import { useAntMessage } from 'src/context/ant-message';
import { TailSpin } from  'react-loader-spinner';
import Pagination from 'src/shared/pagination';
import { moneyFormat } from 'src/helpers/utils';
import * as Yup from 'yup';

function Index() {
  const antMessage = useAntMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const { data, error, isLoading, isFetching, refetch } = useGetAppointmentsQuery({
    search,
    page,
    per_page,
  });

  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (search !== '') {
      setPage(1);
    }
  }, [search]);

  const highlight = item => {

    return {
      style: { 
        backgroundColor: (searchParams.get('appointment_id') && (parseInt(searchParams.get('appointment_id')) === item.id)) ? '#fdeffa' : '#fffff' 
      }
    }
  }

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Appointments</h2>
          <div>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link as={Link} to="/appointments/list">Appointments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/appointments/calendar">Calendar</Nav.Link>
              </Nav.Item>
              <Create />
            </Nav>
          </div>
        </div>
        <Card className="rounded-0">
          <Card.Body>
            <div className="d-flex justify-content-end align-items-center mb-3 mt-3">
              <div style={{ marginRight: 10, marginLeft: 10 }}>
                {isFetching ? (
                  <TailSpin
                    height="20"
                    width="20"
                    color="#4fa94d"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : <Button variant="link" size="sm" className="text-dark p-0 text-decoration-none" onClick={() => refetch()}><FaSync /> Refresh Table</Button>}
              </div>
              <InputGroup style={{ width: 200 }}>
                <InputGroup.Text>
                  Per Page
                </InputGroup.Text>
                <Form.Select
                  onChange={event => setPerPage(event.target.value)}
                >
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </Form.Select>
              </InputGroup>
              <InputGroup style={{ width: 400, marginRight: 10, marginLeft: 10 }}>
                <Form.Control
                  placeholder="Search..."
                  onChange={event => setSearch(event.target.value)}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </div>
            {error ? (
              <p>Oh no, there was an error</p>
            ) : (isLoading || isFetching) ? (
              <Loader />
            ) : data ? (
              <div className="mt-3">
                <Table borderless hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Schedule</th>
                      <th>Services</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Booked On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map(item => (
                      <tr key={item.id}>
                        <td {...highlight(item)}>{item.id}</td>
                        <td {...highlight(item)}>{item.type}</td>
                        <td {...highlight(item)}>{item.name ? item.name : '[Deleted User]'}</td>
                        <td {...highlight(item)}>{item.schedule_formatted}</td>
                        <td {...highlight(item)}>{item.appointment_stylist_service.map(service => <p className="mb-0">{`${service.service.name} - ${service.stylist.first_name} \n`}</p>)}</td>
                        <td {...highlight(item)}>
                          <p className="mb-0">Type: {item.payment_type}</p>
                          <p className="mb-0">Status: {item.payment_status}</p>
                          <p className="mb-0">Total Amount: {moneyFormat(item.total_amount)}</p>
                          <p className="mb-0">Total Paid: {moneyFormat(item.total_paid)}</p>
                          <p className={`mb-0 ${item.payment_status === 'Paid' ? 'text-secondary' : 'text-danger'}`}>Unpaid Balance: {moneyFormat(item.balance)}</p>
                        </td>
                        <td {...highlight(item)}>{item.status}</td>
                        <td {...highlight(item)}>{item.created_at_formatted}</td>
                        <td {...highlight(item)}>
                          {item.status === 'Pending' && <Verified item={item} antMessage={antMessage} />}
                          {item.status === 'Verified' && (
                            <>
                              <Edit item={item} antMessage={antMessage} />
                              <Done item={item} antMessage={antMessage} />
                            </>
                          )}
                          <Delete item={item} antMessage={antMessage} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination
                  page={page}
                  onPageClick={_page => setPage(_page)}
                  data={data}
                  loading={isLoading}
                />
              </div>
            ) : null}
           </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Index;