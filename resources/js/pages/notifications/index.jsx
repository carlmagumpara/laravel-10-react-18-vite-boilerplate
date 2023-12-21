import React, { useState, useEffect } from 'react';
import { useGetNotificationsQuery } from 'src/redux/services/notifications';
import { Container, Card, ListGroup, Button, ButtonGroup } from 'react-bootstrap';
import Loader from 'src/shared/loader';
import { LinkContainer } from 'react-router-bootstrap';
import Pagination from 'src/shared/pagination';
import { useAntMessage } from 'src/context/ant-message';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';

function Index() {
  const auth = useAuth();  
  const navigate = useNavigate();
  const antMessage = useAntMessage();
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching, refetch } = useGetNotificationsQuery({
    page,
    per_page: 10,
  });

  useEffect(() => {
    refetch();
  }, []);

  const open = item => event => {
    event.preventDefault();
    
    if (item.data.key === 'appointments') {
      return navigate(`/appointments/list?appointment_id=${item.data.appointment_id}`);
    }

    return;
  };

  return (
    <>
      <Container>
        <h2 className="mb-3">Notifications</h2>
        <Card className="rounded-0">
          <Card.Body>
            {error ? (
              <p>Oh no, there was an error</p>
            ) : (isLoading || isFetching) ? (
              <Loader />
            ) : data ? (
              <>
                <ListGroup className="mb-3">
                  {data.data.map(item => (
                    <ListGroup.Item action onClick={open(item)} className="p-3">
                      <div className="d-flex align-items-start">
                        <div className="flex-grow-1 ms-1">
                          <div className="ms-2 me-auto">
                            <h6>{item.data.content}</h6>
                            <p className="muted mb-0 lh-sm"><small>{moment(item.created_at).fromNow()}</small></p>
                          </div>
                        </div>
                      </div>                  
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Pagination
                  page={page}
                  onPageClick={_page => setPage(_page)}
                  data={data}
                  loading={isLoading}
                />
              </>
            ) : null}
           </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Index;