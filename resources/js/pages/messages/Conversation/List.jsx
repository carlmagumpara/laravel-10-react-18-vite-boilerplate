import { useState, useEffect } from 'react';
import { ListGroup, Form, InputGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetConversationsQuery } from 'src/redux/services/conversations';
import { useAuth } from 'src/hooks/useAuth';
import Loader from 'src/shared/loader';
import SeeMore from 'src/shared/see-more';
import { FaSearch } from 'react-icons/fa';
import { useOnline } from 'src/context/online';
import moment from 'moment';

function List() {
  const auth = useAuth();
  const online = useOnline();
  const [query, setQuery] = useState('');
  const { data, error, isLoading, isFetching, refetch } = useGetConversationsQuery({
    query
  }, { pollingInterval: 3000 });
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  useEffect(() => {
    refetch();
  }, []);

  const onChange = event => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <div className="p-2">
        <InputGroup>
          <Form.Control
            onChange={onChange} 
            value={query}
            className="border bg-white"
            placeholder="Search user..."
          />
          <InputGroup.Text className="bg-white">
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
      </div>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <><Loader /></>
      ) : data ? (
        <div>
          <ListGroup className="chat-users-list">
            {data.map(data => (
              <LinkContainer key={data.id} to={`/messages/${data.id}`}>
                <ListGroup.Item action className="border-0 rounded-0">
                  {data.unread !== 0 ? <div className="badge bg-success float-end">{data.unread}</div> : null}
                  <div className="d-flex align-items-start">
                    <div className="avatars">
                      {data.participants.filter(participant => participant.user_id != auth.getId).map(participant => (
                        <span className="avatar">
                          <div className={online.find(_user => _user.user_id === participant.user_id) ? 'online status' : 'offline status'} />
                          <img src={participant?.user?.photo} width={40} height={40} className="bg-secondary" />
                        </span>
                      ))}
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <span>{formatter.format(data.participants.filter(participant => participant.user_id != auth.getId).map(participant => `${participant?.user ? `${participant?.user?.first_name} ${participant?.user?.last_name}` : '[Deleted User]' }`))}</span>
                      <div className="small"><span className="fas fa-circle chat-online" /> <SeeMore string={data?.last_message?.message || ''} count={30} /> <br /> {moment(data.created_at).fromNow()}  </div>
                    </div>
                  </div>
                </ListGroup.Item>
              </LinkContainer>
            ))}
          </ListGroup>
        </div>
      ) : null}
    </div>
  )
}

export default List;