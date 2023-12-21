import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Table } from 'react-bootstrap';
import { useUpdateProfileMutation } from 'src/redux/services/profile'; 

import { useDispatch } from 'react-redux';
import { storeUser } from 'src/redux/reducers/user';
import { updateState } from 'src/redux/updateState';

import { useAuth } from 'src/hooks/useAuth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import Avatar from './Avatar';

function Index() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const antMessage = useAntMessage();

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await updateProfile(values).unwrap();
      if (response.success) {
        await dispatch(updateState(storeUser(response.user)));
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
      callback();
    } catch (error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  return (
    <Container>
      <h2 className="mb-3">Profile</h2>
      <Card className="rounded-0">
        <Card.Body className="pt-5">
          <Row>
            <Col md={9}>
              <Formik
                initialValues={{
                  first_name: '',
                  last_name: '',
                  gender: '',
                  date_of_birth: '',
                  address: '',
                  ...auth.getUser,
                }}
                validationSchema={Yup.object().shape({
                  first_name: Yup.string().required('Required').nullable(),
                  last_name: Yup.string().required('Required').nullable(),
                  gender: Yup.string().required('Required').nullable(),
                  date_of_birth: Yup.string().required('Required').nullable(),
                  address: Yup.string().required('Required').nullable(),
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
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control 
                          type="text"
                          name="first_name"
                          placeholder="First Name"
                          value={values.first_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.first_name && touched.first_name && 'is-invalid'}
                        />
                        {errors.first_name && touched.first_name && <div className="invalid-feedback custom-invalid-feedback">{errors.first_name}</div>}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Middle Name</Form.Label>
                        <Form.Control 
                          type="text"
                          name="middle_name"
                          placeholder="Middle Name (Optional)"
                          value={values.middle_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.middle_name && touched.middle_name && 'is-invalid'}
                        />
                        {errors.middle_name && touched.middle_name && <div className="invalid-feedback">{errors.middle_name}</div>}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control 
                          type="text"
                          name="last_name"
                          placeholder="Last Name"
                          value={values.last_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.last_name && touched.last_name && 'is-invalid'}
                        />
                        {errors.last_name && touched.last_name && <div className="invalid-feedback custom-invalid-feedback">{errors.last_name}</div>}
                      </Form.Group>
                    </Col>
                  </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Select
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.gender && touched.gender && 'is-invalid'}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Form.Select>
                          {errors.gender && touched.gender && <div className="invalid-feedback">{errors.gender}</div>}
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Date of Birth</Form.Label>
                          <Form.Control
                            max={moment().format("YYYY-MM-DD")}
                            type="date"
                            name="date_of_birth"
                            placeholder="Date of Birth."
                            value={values.date_of_birth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.date_of_birth && touched.date_of_birth && 'is-invalid'}
                          />
                          {errors.date_of_birth && touched.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control 
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.address && touched.address && 'is-invalid'}
                          />
                          {errors.address && touched.address && <div className="invalid-feedback custom-invalid-feedback">{errors.address}</div>}
                        </Form.Group>
                      </Col>
                    </Row>
                  <div className="d-flex justify-content-end align-items-center">
                    <Button 
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Please wait...' : 'Update'}
                    </Button>
                  </div>
                </Form>
               )}
              </Formik>
            </Col>
            <Col md={3}>
              <Avatar />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Index;