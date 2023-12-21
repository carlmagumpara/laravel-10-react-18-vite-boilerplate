import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Conversation from './Conversation';
import ConversationList from './Conversation/List';
import './chat.scss';

function Index() {
  const { conversation_id } = useParams();
  const dispatch = useDispatch();

  return (
    <Card>
      <Row className="g-0">
        <Col sm={3} className="border-end">
          <ConversationList />
        </Col>
        <Col sm={9} className="">
          {conversation_id ? <Conversation key={conversation_id} id={conversation_id} /> : <div className="no-selected-message d-flex justify-content-center align-items-center"><p>Select Message...</p></div>}
        </Col>
      </Row>
    </Card>
  );
}

export default Index;