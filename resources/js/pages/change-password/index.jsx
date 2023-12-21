import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Table } from 'react-bootstrap';
import { useUpdatePasswordMutation } from 'src/redux/services/profile'; 
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import { confirm } from 'src/shared/confirm';

const PasswordSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
  password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

function Index() {
  const antMessage = useAntMessage();
  const [updatePassword] = useUpdatePasswordMutation();

  const submit = async (values, callback, setErrors, resetForm) => {
    try {
      const response = await updatePassword(values).unwrap();
      resetForm({
        password: '',
        password_confirmation: '',
      });
      antMessage.success('Password Updated Successfully!');
      callback();
    } catch (error) {
      console.log(error);
      callback();
    }
  };

  return (
    <Container>
      <h2 className="mb-3">Change Password</h2>
      <Card className="rounded-0">
        <Card.Body className="pt-5">
          <Formik
            initialValues={{
              password: '',
              password_confirmation: '',
            }}
            validationSchema={PasswordSchema}
            onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
              setSubmitting(true);
               setTimeout(() => {
                submit(values, () => {
                  setSubmitting(false);
                }, setErrors, resetForm);
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
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password && 'is-invalid'}
                />
                {errors.password && touched.password && <div className="invalid-feedback">{errors.password}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password_confirmation"
                  placeholder="Password Confirmation"
                  value={values.password_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password_confirmation && touched.password_confirmation && 'is-invalid'}
                />
                {errors.password_confirmation && touched.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
              </Form.Group>
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
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Index;