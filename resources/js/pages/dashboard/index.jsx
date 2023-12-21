import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Table, Dropdown } from 'react-bootstrap';
import { useGetDashboardQuery } from 'src/redux/services/dashboard';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/shared/loader';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { camelCase } from 'src/helpers/utils';

Chart.register(...registerables);

function Index() {
  const navigate = useNavigate();
  const { data, error, isLoading, isFetching, refetch } = useGetDashboardQuery({});
  const [chart_view, setChartView] = useState('by_week')
  const [chart, setChart] = useState(false);

  useEffect(() => {
    refetch();
    setChart(true);

    return () => setChart(false);
  }, []);

  return (
    <Container>
      <h2 className="mb-3">Dashboard</h2>
      <Row className="mb-4">
        <Col className="d-flex align-items-stretch">
          <Card className="border-0 w-100 text-white" style={{ backgroundColor: '#fbc1f0', color: '#7f4d77' }} as={Button} onClick={() => {}}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              {error ? (
                <p>Oh no, there was an error</p>
              ) : (isLoading || isFetching) ? (
                <Loader />
              ) : data ? (
                <h1 className="p-0 me-3">{data.counts.clients}</h1>
              ) : null}
              <p className="mb-0">No of Clients</p>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex align-items-stretch">
          <Card className="border-0 w-100 text-white" style={{ backgroundColor: '#fbc1f0', color: '#7f4d77' }} as={Button} onClick={() => {}}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              {error ? (
                <p>Oh no, there was an error</p>
              ) : (isLoading || isFetching) ? (
                <Loader />
              ) : data ? (
                <h1 className="p-0 me-3">{data.counts.appointments}</h1>
              ) : null}
              <p className="mb-0">No of Appointments</p>
             </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="d-flex align-items-stretch">
          <Card className="border-0 w-100 text-white" style={{ backgroundColor: '#fbc1f0', color: '#7f4d77' }} as={Button} onClick={() => {}}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              {error ? (
                <p>Oh no, there was an error</p>
              ) : (isLoading || isFetching) ? (
                <Loader />
              ) : data ? (
                <h1 className="p-0 me-3">{data.counts.services}</h1>
              ) : null}
              <p className="mb-0">No of Services</p>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex align-items-stretch">
          <Card className="border-0 w-100 text-white" style={{ backgroundColor: '#fbc1f0', color: '#7f4d77' }} as={Button} onClick={() => {}}>
            <Card.Body className="d-flex justify-content-between align-items-center">
              {error ? (
                <p>Oh no, there was an error</p>
              ) : (isLoading || isFetching) ? (
                <Loader />
              ) : data ? (
                <h1 className="p-0 me-3">{data.counts.stylists}</h1>
              ) : null}
              <p className="mb-0">No of Stylists</p>
             </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 6 }}>
          <Card className="border-0 bg-light-blue mb-5">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white" style={{ height: 50 }}>
              <p className="mb-0 h6">Clients</p>
              <Dropdown>
                <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
                  {camelCase(chart_view.replace('by_', ''))}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setChartView('by_week')}>Week</Dropdown.Item>
                  <Dropdown.Item onClick={() => setChartView('by_month')}>Month</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              {error ? (
                <>Oh no, there was an error</>
              ) : (isLoading || isFetching) ? (
                <><Loader /></>
              ) : data ? (
                chart ? (
                  <Bar
                    height="300px"
                    data={{
                      labels: data?.chart?.users?.[chart_view]?.labels,
                      datasets: [
                        {
                          label: 'Clients',
                          data: data?.chart?.users?.[chart_view]?.data,
                          backgroundColor: ['#f793e7', '#fca08b', '#ffec96', '#b8fbff', '#bdccff'],
                          borderRadius : 10,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          grid: {
                            display: false
                          }
                        }
                      },
                    }}
                  />
                ) : null
              ) : null}
            </Card.Body>
          </Card>
        </Col>
        <Col md={{ span: 6 }}>
          <Card className="border-0 bg-light-blue mb-5">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white" style={{ height: 50 }}>
              <p className="mb-0 h6">Services</p>
            </Card.Header>
            <Card.Body>
              {error ? (
                <>Oh no, there was an error</>
              ) : (isLoading || isFetching) ? (
                <><Loader /></>
              ) : data ? (
                chart ? (
                  <Bar
                    height="300px"
                    data={{
                      labels: data?.chart?.services.map(service => service.name),
                      datasets: [
                        {
                          label: 'Services',
                          data: data?.chart?.services?.map(service => service.appointment_stylist_service_count),
                          backgroundColor: ['#f793e7', '#fca08b', '#ffec96', '#b8fbff', '#bdccff'],
                          borderRadius : 10,
                        }
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          grid: {
                            display: false
                          }
                        }
                      },
                    }}
                  />
                ) : null
              ) : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Index;