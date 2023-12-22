import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image, Dropdown, Tab, Tabs } from 'react-bootstrap';
import { FaTrash, FaPencilAlt, FaEye, FaEnvelope, FaFile } from 'react-icons/fa';
import moment from 'moment';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from 'src/redux/services/user';
import { confirm } from 'src/shared/confirm';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

const header = { 'admin': 'Admin', 'client': 'Client', 'freelancer': 'Freelancer' };

function Create({ antMessage, role }) {
  const [createUser] = useCreateUserMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await createUser({ ...values, role }).unwrap();
      console.log(response);
      if (response.success) {
        setShow(false);
        antMessage.success(response.message);
      } else {
        antMessage.error(response.message);
      }
    } catch(error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button onClick={handleShow}>Add {header[role]}</Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Add {header[role]}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            username: '',
            contact_no: '',
            password: '',
            password_confirmation: '',
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required('Required').nullable(),
            last_name: Yup.string().required('Required').nullable(),
            address: Yup.string().required('Required').nullable(),
            username: Yup.string().required('Required').nullable(),
            contact_no: Yup.string().required('Required').nullable(),
            password: Yup.string().required('Required'),
            password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
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
            <Modal.Body>
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
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username && 'is-invalid'}
                />
                {errors.username && touched.username && <div className="invalid-feedback custom-invalid-feedback">{errors.username}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text"
                  name="contact_no"
                  placeholder="Contact No."
                  value={values.contact_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.contact_no && touched.contact_no && 'is-invalid'}
                />
                {errors.contact_no && touched.contact_no && <div className="invalid-feedback custom-invalid-feedback">{errors.contact_no}</div>}
              </Form.Group>
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
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={handleClose} >
                Close
              </Button>
              <Button 
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Please wait...' : 'Submit'}
              </Button>
            </Modal.Footer>
          </Form>
         )}
        </Formik>
      </Modal>
    </>
  );
}

function View({ application = null, modalTitle = 'Show Profile', antMessage, role, item }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  
  const handleShow = () => setShow(true);

  return (
    <>
      <Button 
        size="sm"
        className="m-1"
        variant="success"
        onClick={() => setShow(true)}
      >
        <FaEye />
      </Button>
      <Modal size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={3}>
              <div id="profile-container" className="mb-3 position-relative">
                <Image id="profileImage" src={item.photo} className="bg-white border" style={{ objectFit: 'cover' }} alt="" />
              </div>
            </Col>
            <Col md={9}>
              <dl className="row mb-4">
                <dt className="col-sm-3">Name</dt>
                <dd className="col-sm-9">{item.first_name} {item.last_name}</dd>
              </dl>
              <dl className="row mb-4">
                <dt className="col-sm-3">Contact No.</dt>
                <dd className="col-sm-9">{item.contact_no}</dd>
              </dl>
              <dl className="row mb-4">
                <dt className="col-sm-3">Username</dt>
                <dd className="col-sm-9">{item.username}</dd>
              </dl>
              <dl className="row mb-4">
                <dt className="col-sm-3">Address</dt>
                <dd className="col-sm-9">{item.address}</dd>
              </dl>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleClose} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function Edit({ item, antMessage }) {
  const [updateUser] = useUpdateUserMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await updateUser({ id: item.id, data: values }).unwrap();
      setShow(false);
      antMessage.success(response.message);
    } catch(error) {
      setShow(false);
      antMessage.error(JSON.stringify(error.data));
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  return (
    <>
      <Button 
        size="sm"
        className="m-1"
        variant="info"
        onClick={() => setShow(true)}
      >
        <FaPencilAlt />  
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Edit {header[item.role]}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            first_name: '',
            last_name: '',
            username: '',
            contact_no: '',
            ...item
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required('Required').nullable(),
            last_name: Yup.string().required('Required').nullable(),
            address: Yup.string().required('Required').nullable(),
            username: Yup.string().required('Required').nullable(),
            contact_no: Yup.string().required('Required').nullable(),
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
            <Modal.Body>
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
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username && 'is-invalid'}
                />
                {errors.username && touched.username && <div className="invalid-feedback custom-invalid-feedback">{errors.username}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control 
                  type="text"
                  name="contact_no"
                  placeholder="Contact No."
                  value={values.contact_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.contact_no && touched.contact_no && 'is-invalid'}
                />
                {errors.contact_no && touched.contact_no && <div className="invalid-feedback custom-invalid-feedback">{errors.contact_no}</div>}
              </Form.Group>
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
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="secondary" onClick={handleClose} >
                Close
              </Button>
              <Button 
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Please wait...' : 'Submit'}
              </Button>
            </Modal.Footer>
          </Form>
         )}
        </Formik>
      </Modal>
    </>
  );
}

function Delete({ antMessage, item }) {
  const [deleteUser] = useDeleteUserMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="danger"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Delete Item', confirmation: 'Are you sure you want to delete this item?' })) {
            const response = await deleteUser({ id: item.id }).unwrap();
            antMessage.success(response.message);
          }
        } catch (error) {
          antMessage.error(JSON.stringify(error.data));
        }
      }}
    >
      <FaTrash />
    </Button>
  )
}

export { Create, View, Edit, Delete };
