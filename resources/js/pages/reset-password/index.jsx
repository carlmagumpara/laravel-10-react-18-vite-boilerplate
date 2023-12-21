import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useResetPasswordMutation } from 'src/redux/services/login'; 
import { Formik } from 'formik';
import * as Yup from 'yup';
import logo from 'src/assets/logo.png';
import Password from 'src/pages/login/Password';
import { useAntMessage } from 'src/context/ant-message';
import { confirm } from 'src/shared/confirm';

function Index() {
  const antMessage = useAntMessage();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useParams();

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await resetPassword(values).unwrap();
      console.log(response);
      if (response.success) {
        antMessage.success(response.message);
        navigate('/login');
      } else {
        antMessage.error(response.message);
      }
      callback();
    } catch(error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  return (
    <>
      <Container className="pt-5 pb-5">
        <Row className="d-flex align-items-center">
          <Col md={{ span: 4, offset: 4 }}>
            <div className="text-center">
              <img src={logo} className="mb-3 w-100" />
            </div>
            <Card className="">
              <Card.Header className="bg-white p-3 border-0" as="h4">
                Reset Password
              </Card.Header>
              <Card.Body>
                <Formik
                  initialValues={{ 
                    email: searchParams.get('email'),
                    token,
                    password: '',
                    password_confirmation: '',
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().required('Required'),
                    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
                  })}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    setSubmitting(true);
                    setTimeout(() => {
                      submit(values, () => {
                        setSubmitting(false);
                      }, setErrors);
                    }, 400);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                 }) => (
                  <Form onSubmit={handleSubmit} autoComplete="new-off">
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.email && touched.email && 'is-invalid'}
                        disabled={true}
                      />
                      {errors.email && touched.email && <div className="invalid-feedback custom-invalid-feedback">{errors.email}</div>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Password
                        type="password" 
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password && touched.password && 'is-invalid'}
                        renderErrors={() => errors.password && touched.password && <div className="invalid-feedback custom-invalid-feedback" dangerouslySetInnerHTML={{__html: errors.password }}></div>}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Password Confirmation</Form.Label>
                      <Password
                        type="password" 
                        name="password_confirmation"
                        placeholder="Password Confirmation"
                        value={values.password_confirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.password_confirmation && touched.password_confirmation && 'is-invalid'}
                        renderErrors={() => errors.password_confirmation && touched.password_confirmation && <div className="invalid-feedback custom-invalid-feedback" dangerouslySetInnerHTML={{__html: errors.password_confirmation }}></div>}
                      />
                    </Form.Group>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <Button disabled={isSubmitting} variant="primary" type="submit" className="w-100">
                        {isSubmitting ? 'Please wait...' : 'Reset Password'}
                      </Button>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button variant="link" size="sm" onClick={() => navigate('/login')}>Login Now</Button>
                    </div>
                  </Form>
                 )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Index;