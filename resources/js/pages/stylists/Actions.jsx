import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image, Dropdown } from 'react-bootstrap';
import { FaTrash, FaPencilAlt, FaEye, FaEnvelope, FaFile } from 'react-icons/fa';
import moment from 'moment';
import { useAddStylistMutation, useUpdateStylistMutation, useDeleteStylistMutation } from 'src/redux/services/stylists';
import { confirm } from 'src/shared/confirm';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import StylistPosition from './StylistPosition';

const colors = ['#f793e7', '#fca08b', '#ffec96', '#b8fbff', '#bdccff'];

function Create({ antMessage }) {
  const [createStylist] = useAddStylistMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await createStylist(values).unwrap();
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
        <Button onClick={handleShow}>Add Stylist</Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Add Stylist</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            stylist_position_id: '',
            first_name: '',
            last_name: '',
            color: '',
            availability_status: 'Available',
          }}
          validationSchema={Yup.object().shape({
            stylist_position_id: Yup.string().required('Required').nullable(),
            first_name: Yup.string().required('Required').nullable(),
            last_name: Yup.string().required('Required').nullable(),
            color: Yup.string().required('Required').nullable(),
            availability_status: Yup.string().required('Required').nullable(),
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
           setFieldValue
         }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
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
                <Form.Label>Color</Form.Label>
                <div className="d-flex justify-content-start gap-2">
                  {colors.map(color => <div key={color} onClick={() => setFieldValue('color', color)} style={{ border: `2px solid ${values.color === color ? '#FF0000' : '#aeaeae'}`, width: 30, height: 30, backgroundColor: color }}></div>)}
                </div>
                <Form.Control 
                  type="hidden"
                  name="color"
                  value={values.color}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.color && touched.color && 'is-invalid'}
                />
                {errors.color && touched.color && <div className="invalid-feedback custom-invalid-feedback">{errors.color}</div>}
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
  const [updateStylist] = useUpdateStylistMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await updateStylist({ id: item.id, data: values }).unwrap();
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
          <Modal.Title>Edit Stylist</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            stylist_position_id: '',
            first_name: '',
            last_name: '',
            color: '',
            availability_status: '',
            ...item
          }}
          validationSchema={Yup.object().shape({
            stylist_position_id: Yup.string().required('Required').nullable(),
            first_name: Yup.string().required('Required').nullable(),
            last_name: Yup.string().required('Required').nullable(),
            color: Yup.string().required('Required').nullable(),
            availability_status: Yup.string().required('Required').nullable(),
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
           setFieldValue
         }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
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
                <Form.Label>Color</Form.Label>
                <div className="d-flex justify-content-start gap-2">
                  {colors.map(color => <div key={color} onClick={() => setFieldValue('color', color)} style={{ border: `2px solid ${values.color === color ? '#FF0000' : '#aeaeae'}`, width: 30, height: 30, backgroundColor: color }}></div>)}
                </div>
                <Form.Control 
                  type="hidden"
                  name="color"
                  value={values.color}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.color && touched.color && 'is-invalid'}
                />
                {errors.color && touched.color && <div className="invalid-feedback custom-invalid-feedback">{errors.color}</div>}
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
  const [deleteStylist] = useDeleteStylistMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="danger"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Delete Item', confirmation: 'Are you sure you want to delete this item?' })) {
            const response = await deleteStylist({ id: item.id }).unwrap();
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

function ChangeColor({ item, antMessage }) {
  const [updateStylist] = useUpdateStylistMutation();
  const [show, setShow] = useState(false);

  const changeColor = async (color) => {
    try {
      const response = await updateStylist({ id: item.id, data: { ...item, color } }).unwrap();
      antMessage.success(response.message);
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-start gap-2">
      {colors.map(color => <div key={color} onClick={() => changeColor(color)} style={{ border: `2px solid ${item.color === color ? '#FF0000' : '#aeaeae'}`, width: 30, height: 30, backgroundColor: color }}></div>)}
    </div>
  );
}

export { Create, Edit, Delete, ChangeColor };
