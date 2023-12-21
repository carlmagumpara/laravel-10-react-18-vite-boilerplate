import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/shared/loader';

function Index() {
  const navigate = useNavigate();

  return (
    <Container>
      <h2 className="mb-3">Reports</h2>
    </Container>
  );
}

export default Index;