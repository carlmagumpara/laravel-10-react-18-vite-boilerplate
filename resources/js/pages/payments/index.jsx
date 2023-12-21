import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, InputGroup } from 'react-bootstrap';
import { useGetPaymentsQuery } from 'src/redux/services/payments';
import { FaSync, FaSearch } from 'react-icons/fa';
import { confirm } from '../../shared/confirm';
import Loader from 'src/shared/loader';
import { useAntMessage } from 'src/context/ant-message';
import { TailSpin } from  'react-loader-spinner';
import { moneyFormat } from 'src/helpers/utils';
import Pagination from 'src/shared/pagination';
import { Link } from 'react-router-dom';

function Index() {
  const antMessage = useAntMessage();
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const { data, error, isLoading, isFetching, refetch } = useGetPaymentsQuery({
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

  return (
    <Container>
      <h2 className="mb-3">Payments</h2>
      <Card className="border-0">
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
                    <th>Date | Time</th>
                    <th>Name</th>
                    <th>Service(s)</th>
                    <th>Invoice No.</th>
                    <th>Reference Number</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(item => (
                    <tr key={item.id}>
                      <td>{item.created_at_formatted}</td>
                      <td>{item.user.first_name} {item.user.last_name}</td>
                      <td>{formatter.format(item?.appointment?.appointment_stylist_service.map(service => service.service.name) || [])}</td>
                      <td>{item.id}</td>
                      <td>{item.reference_number}</td>
                      <td>{item.method}</td>
                      <td>{moneyFormat(item.amount)}</td>
                      <td>{item.status}</td>
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
  );
}

export default Index;