import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Password({ renderErrors, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <InputGroup>
      <Form.Control 
        {...props}
        type={show ? 'text' : 'password'}
      />
      <Button variant="primary" onClick={() => setShow(prevState => !prevState)}>
        {show ? <FaEye /> : <FaEyeSlash />}
      </Button>
      {renderErrors()}
    </InputGroup>
  )
}

export default Password