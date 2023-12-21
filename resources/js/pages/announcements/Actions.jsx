import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image, Dropdown } from 'react-bootstrap';
import { FaTrash, FaPencilAlt, FaEye, FaEnvelope, FaFile } from 'react-icons/fa';
import moment from 'moment';
import { useAddAnnouncementMutation, useUpdateAnnouncementMutation, useDeleteAnnouncementMutation } from 'src/redux/services/announcements';
import { confirm } from 'src/shared/confirm';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import { Formik } from 'formik';
import * as Yup from 'yup';

function Create({ antMessage }) {
  const [createAnnouncement] = useAddAnnouncementMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await createAnnouncement(values).unwrap();
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
        <Button onClick={handleShow}>Add Announcement</Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Add Announcement</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            title: '',
            body: '',
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required').nullable(),
            body: Yup.string().required('Required').nullable(),
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
                <Form.Label>Title</Form.Label>
                <Form.Control 
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.title && touched.title && 'is-invalid'}
                />
                {errors.title && touched.title && <div className="invalid-feedback">{errors.title}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <Form.Control 
                  as="textarea"
                  name="body"
                  placeholder="Body"
                  value={values.body}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.body && touched.body && 'is-invalid'}
                />
                {errors.body && touched.body && <div className="invalid-feedback">{errors.body}</div>}
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
  const [updateAnnouncement] = useUpdateAnnouncementMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    try {
      const response = await updateAnnouncement({ id: item.id, data: values }).unwrap();
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
          <Modal.Title>Edit Announcement</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            title: '',
            body: '',
            ...item
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Required').nullable(),
            body: Yup.string().required('Required').nullable(),
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
                <Form.Label>Title</Form.Label>
                <Form.Control 
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.title && touched.title && 'is-invalid'}
                />
                {errors.title && touched.title && <div className="invalid-feedback">{errors.title}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <Form.Control 
                  as="textarea"
                  name="body"
                  placeholder="Body"
                  value={values.body}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.body && touched.body && 'is-invalid'}
                />
                {errors.body && touched.body && <div className="invalid-feedback">{errors.body}</div>}
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
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="danger"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Delete Item', confirmation: 'Are you sure you want to delete this item?' })) {
            const response = await deleteAnnouncement({ id: item.id }).unwrap();
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
