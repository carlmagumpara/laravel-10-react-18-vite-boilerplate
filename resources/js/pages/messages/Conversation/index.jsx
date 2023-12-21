import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useGetConversationQuery, useGetMessagesQuery, useAddMessageMutation } from 'src/redux/services/conversations';
import { useAuth } from 'src/hooks/useAuth';
import Echo from 'src/helpers/echo';
import { FaPaperPlane } from 'react-icons/fa';
import moment from 'moment';
import { useOnline } from 'src/context/online';

function Details({ id, channel, roomUpdates }) {
  const auth = useAuth();
  const online = useOnline();
  const { data, error, isLoading, isFetching, refetch } = useGetConversationQuery({ id }, { pollingInterval: 5000 });
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  console.log(data, error, isLoading);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <div className="position-relative">
            <div className="avatars">
              {data?.participants?.map(participant => (
                <span className="avatar" key={participant.user_id}>
                  <div className={online.find(_user => _user.user_id === participant.user_id) ? 'online status' : 'offline status'} />
                  <img src={participant?.user?.photo} width={40} height={40} className="bg-secondary" />
                </span>
              ))}
            </div>
          </div>
          <div className="flex-grow-1 ps-3">
            {data.product ? (
              <strong>{`#${data.product.id} - ${data.product.name}`}</strong>
            ) : (
              <strong>{formatter.format(data?.participants?.map(participant => `${participant?.user ? `${participant?.user.first_name} ${participant?.user.last_name}` : '[Deleted User]'}`) || [])}</strong>
            )}
            <div className="text-dark small"><em>{roomUpdates.typing.length !== 0 ? `${formatter.format(roomUpdates.typing)} is typing...` : ''}</em></div>
          </div>
        </>
      ) : null}
    </>
  );
}

function Conversation({ id, details = true }) {
  const auth = useAuth();
  const socket = useRef(null);
  const typing_timeout = useRef(null);
  const channel = `conversation.${id}`;
  const { data, error, isLoading, isFetching, refetch } = useGetMessagesQuery({ channel, id }, { pollingInterval: 5000 });
  const [room_updates, setRoomUpdates] = useState({
    typing: [],
  });
  const [addMessage] = useAddMessageMutation();
  const [message, setMessage] = useState('');
  const messageEl = useRef(null);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    socket.current = Echo(auth.getToken)
    .join(`${channel}.room-updates`)
    .listenForWhisper('typing', event => {
      setRoomUpdates(prevState => ({
        ...prevState,
        typing: prevState.typing.filter((v,i) => prevState.typing.indexOf(v) == i),
      }));
      if (typing_timeout.current) {
        clearInterval(typing_timeout.current);
      }
      typing_timeout.current = setTimeout(() => {
        setRoomUpdates(prevState => ({
          ...prevState,
          typing: prevState.typing.filter(user => user !== event.user),
        }));
      }, 5000);
    });
  }, []);

  const onChange = event => {
    socket.current.whisper('typing', {
      user: auth.getName,
    });
    setMessage(event.target.value);
  };

  const submit = event => {
    event.preventDefault();

    addMessage({
      message,
      id,
    });

    setMessage('');
  };

  useEffect(() => {
    if (messageEl) {
      setTimeout(() => {
        messageEl.current.addEventListener('DOMNodeInserted', event => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: 'auto' });
        });
      }, 100);
    }
  }, []);

  const messages = array => {
    const ids = array.map(o => o.id);

    return array.filter(({ id }, index) => !ids.includes(id, index + 1));
  };

  return (
    <>
      {details ? (
      <div className="py-2 px-4 border-bottom d-none d-lg-block">
        <div className="d-flex align-items-center py-1">
          <Details id={id} channel={channel} roomUpdates={room_updates} />
          <div>
            <button className="d-none btn btn-primary btn-lg me-1 px-3"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone feather-lg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg></button>
            <button className="d-none btn btn-info btn-lg me-1 px-3"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-video feather-lg"><polygon points="23 7 16 12 23 17 23 7" /><rect x={1} y={5} width={15} height={14} rx={2} ry={2} /></svg></button>
            <button className="d-none btn btn-light border btn-lg px-3"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal feather-lg"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg></button>
          </div>
        </div>
      </div>
      ) : null}
      <div className="position-relative">
        <div className="chat-messages p-4" style={(!details ? { height: 'calc(100vh - 73px - 60px)'} : {})} ref={messageEl}>
          {error ? (
            <>Oh no, there was an error</>
          ) : isLoading ? (
            <>Loading...</>
          ) : data ? (
            <>
              {id === 'admin' ? <p className="text-dark small text-center" style={{ fontSize: 11 }}>Good Day {auth.getFirstName}, Admin is runned by a real agent and is not always available but you may send us your concern and inquiries to our chat box — rest assured that you will be assisted shortly by one of our administrators.</p> : null}
              {messages(data || []).map(message => message.user_id === auth.getId ? (
              <div key={message.id} className="chat-message-right pb-4">
                <div>
                  <img src={message.user?.photo} className="rounded-circle me-1" width={40} height={40} />
                  <div className="text-dark small text-nowrap mt-2">{moment(message.created_at).fromNow()}</div>
                </div>
                <div className="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                  <div className="font-weight-bold mb-1">You</div>
                  {message.message}
                </div>
              </div>
              ) : (
              <div key={message.id} className="chat-message-left pb-4">
                <div>
                  <img src={message.user?.photo} className="rounded-circle me-1" alt="Sharon Lessman" width={40} height={40} />
                  <div className="text-dark small text-nowrap mt-2">{moment(message.created_at).fromNow()}</div>
                </div>
                <div className="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                  <div className="font-weight-bold mb-1">{message.user?.first_name ?? '[Deleted User]'}</div>
                  {message.message}
                </div>
              </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
      <div className="flex-grow-0 py-3 px-4 border-top">
        <form onSubmit={submit}>
          <div className="input-group">
            <input type="text" className="form-control" onChange={onChange} value={message} placeholder="Type your message" />
            <button className="btn btn-primary" type="submit" disabled={!message}><FaPaperPlane /> </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Conversation;