import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useForgotPasswordMutation } from 'src/redux/services/login'; 
import { storeUser } from 'src/redux/reducers/user';
import { storeToken } from 'src/redux/reducers/token';
import { updateState } from 'src/redux/updateState';
import { Formik } from 'formik';
import * as Yup from 'yup';
import logo from 'src/assets/logo.png';
import Password from './Password';
import { confirm } from 'src/shared/confirm';
import { useAntMessage } from 'src/context/ant-message';

function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [role_modal, setRoleModal] = useState(false);
  const antMessage = useAntMessage();

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await login(values).unwrap();
      console.log(response);
      if (response.success) {
        antMessage.success(response.message);
        await dispatch(updateState(storeUser(response.user)));
        await dispatch(updateState(storeToken(response.token)));
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
      <Container className="vh-100">
        <Row className="vh-100 d-flex align-items-center">
          <Col md={{ span: 4, offset: 4 }}>
            <div className="text-center">
              <img src={logo} className="mb-3 w-100" />
            </div>
            <Card className="">
              <Card.Header className="bg-white p-3 border-0" as="h4">
                Login
              </Card.Header>
              <Card.Body>
                <Formik
                  initialValues={{ 
                    email: '', 
                    password: '' 
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email('Invalid email').required('Required'),
                    password: Yup.string().required('Required'),
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
                    <div className="d-flex align-items-center justify-content-end mb-3">
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={async () => {
                          const confirmResponse = await confirm({ 
                            title: 'Forgot Password?', 
                            confirmation: '',
                            confirmButtonText: 'Submit',
                            cancelButtonText: 'Cancel',
                            inputs: [
                              { 
                                label: 'Email', 
                                type: 'email', 
                                name: 'email',
                              }
                            ],
                          });
                          if (confirmResponse) {
                            try {
                              const response = await forgotPassword(confirmResponse).unwrap();
                              if (response.success) {
                                antMessage.success(response.message);
                              } else {
                                antMessage.error(response.message);
                              }
                            } catch (error) {
                              console.log(error);
                            }
                          }
                        }}
                      >
                        Forgot Password?
                      </Button>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <Button disabled={isSubmitting} variant="primary" type="submit" className="w-100">
                        {isSubmitting ? 'Please wait...' : 'Login'}
                      </Button>
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