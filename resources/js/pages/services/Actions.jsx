import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image, Dropdown } from 'react-bootstrap';
import { FaTrash, FaPencilAlt, FaEye, FaEnvelope, FaFile } from 'react-icons/fa';
import moment from 'moment';
import { useAddServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from 'src/redux/services/services';
import { confirm } from 'src/shared/confirm';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StylistPosition from 'src/pages/stylists/StylistPosition';

function Create({ antMessage }) {
  const [createService] = useAddServiceMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await createService(values).unwrap();
      setShow(false);
      antMessage.success(response.message);
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
        <Button onClick={handleShow}>Add Service</Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Add Service</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            stylist_position_id: '',
            name: '',
            fee: '',
            duration: '',
          }}
          validationSchema={Yup.object().shape({
            stylist_position_id: Yup.string().required('Required').nullable(),
            name: Yup.string().required('Required').nullable(),
            fee: Yup.string().required('Required').nullable(),
            duration: Yup.string().required('Required').nullable(),
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
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.name && touched.name && 'is-invalid'}
                />
                {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fee</Form.Label>
                <Form.Control 
                  type="number"
                  name="fee"
                  placeholder="Fee"
                  value={values.fee}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fee && touched.fee && 'is-invalid'}
                />
                {errors.fee && touched.fee && <div className="invalid-feedback">{errors.fee}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stylist</Form.Label>
                <StylistPosition
                  name="stylist_position_id"
                  value={values.stylist_position_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.stylist_position_id && touched.stylist_position_id && 'is-invalid'}
                />
                {errors.stylist_position_id && touched.stylist_position_id && <div className="invalid-feedback">{errors.stylist_position_id}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control 
                  type="number"
                  name="duration"
                  placeholder="Duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.duration && touched.duration && 'is-invalid'}
                />
                {errors.duration && touched.duration && <div className="invalid-durationdback">{errors.duration}</div>}
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

function Edit({ item, antMessage }) {
  const [updateService] = useUpdateServiceMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await updateService({ id: item.id, data: values }).unwrap();
      setShow(false);
      antMessage.success(response.message);
    } catch(error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  console.log(item);

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
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            stylist_position_id: item.stylist_position?.[0]?.id,
            name: '',
            fee: '',
            duration: '',
            ...item
          }}
          validationSchema={Yup.object().shape({
            stylist_position_id: Yup.string().required('Required').nullable(),
            name: Yup.string().required('Required').nullable(),
            fee: Yup.string().required('Required').nullable(),
            duration: Yup.string().required('Required').nullable(),
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
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.name && touched.name && 'is-invalid'}
                />
                {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fee</Form.Label>
                <Form.Control 
                  type="number"
                  name="fee"
                  placeholder="Fee"
                  value={values.fee}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.fee && touched.fee && 'is-invalid'}
                />
                {errors.fee && touched.fee && <div className="invalid-feedback">{errors.fee}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stylist</Form.Label>
                <StylistPosition
                  name="stylist_position_id"
                  value={values.stylist_position_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.stylist_position_id && touched.stylist_position_id && 'is-invalid'}
                />
                {errors.stylist_position_id && touched.stylist_position_id && <div className="invalid-feedback">{errors.stylist_position_id}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control 
                  type="number"
                  name="duration"
                  placeholder="Duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.duration && touched.duration && 'is-invalid'}
                />
                {errors.duration && touched.duration && <div className="invalid-durationdback">{errors.duration}</div>}
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

function Delete({ item, antMessage }) {
  const [deleteService] = useDeleteServiceMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="danger"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Delete Item', confirmation: 'Are you sure you want to delete this item?' })) {
            const response = await deleteService({ id: item.id }).unwrap();
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

export { Create, Edit, Delete };
