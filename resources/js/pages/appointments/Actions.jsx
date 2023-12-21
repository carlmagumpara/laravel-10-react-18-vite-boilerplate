import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Table, Image, Dropdown, Nav } from 'react-bootstrap';
import { FaTrash, FaCheck, FaPencilAlt, FaCalendar } from 'react-icons/fa';
import moment from 'moment';
import { useAddAppointmentMutation, useUpdateAppointmentMutation, useDeleteAppointmentMutation, useUpdateServicesAndScheduleMutation, useAvailabilityCheckerMutation } from 'src/redux/services/appointments';
import { confirm } from 'src/shared/confirm';
import { useAntMessage } from 'src/context/ant-message';
import Loader from 'src/shared/loader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Services from './Services';
import StylistPosition from 'src/pages/stylists/StylistPosition';

function ServiceStylist({ type, index, service, onChange, onRemove }) {
  const [state, setState] = useState(service);

  useEffect(() => {
    if (state.service_id && state.stylist_id) {
      onChange(state);
    }
  }, [state]);

  const handleChange = event => {
    setState(prevState => ({
      ...prevState,
      ...(event.target.name === 'service_id' ? { stylist_id: '' } : {}),
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <Row>
      <Col md={4}>
        <Form.Group className="">
          {index === 0 ? <Form.Label>Service</Form.Label> : null}
          <Services
            name="service_id"
            value={state.service_id}
            onChange={handleChange}
            getOptionValue={value => setState(prevState => ({ ...prevState, amount: value.fee }))}
          />
        </Form.Group>
      </Col>
      <Col md={5}>
        <Form.Group className="">
          {index === 0 ? <Form.Label>Stylist</Form.Label> : null}
          <StylistPosition
            type="stylists"
            serviceId={state.service_id}
            name="stylist_id"
            value={state.stylist_id}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col md={type === 'add' ? 2 : 3}>
        <Form.Group className="">
          {index === 0 ? <Form.Label>Amount</Form.Label> : null}
          <Form.Control
            readOnly 
            type="text"
            value={state.amount}
          />
        </Form.Group>
      </Col>
      {type === 'add' ? (
        <Col md={1}>
          {index !== 0 ? (
            <Button 
              size="sm"
              variant="danger"
              onClick={onRemove}
            >
              <FaTrash />
            </Button>
          ) : null}
        </Col>
      ) : null}
    </Row>
  )
}

function Create({ antMessage }) {
  const [addAppointment] = useAddAppointmentMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    const { date, time, ...rest } = values;
    try {
      const response = await addAppointment({ ...rest, schedule: `${date} ${time}` }).unwrap();
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

  const generateHourArray = () => {
    const hours = [];
    for (let hour = 8; hour <= 21; hour++) {
      hours.push(`${hour}:00:00`);
    }
    return hours;
  };

  return (
    <>
      <Nav.Item pill className="bg-primary text-white">
        <Nav.Link className="text-white" onClick={handleShow}>Add New Visit (Walk-in)</Nav.Link>
      </Nav.Item>
      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Add New Visit (Walk-in)</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: '',
            services: [{ service_id: '', stylist_id: '', amount: 0 }],
            total_amount: 0,
            date: '',
            time: '',
            payment_type: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Required').nullable(),
            services: Yup.array()
            .of(Yup.object().shape({
                service_id: Yup.string().required('Required'),
                stylist_id: Yup.string().required('Required'),
                amount: Yup.string().required('Required'),
              }))
            .required('Required'),
            total_amount: Yup.string().required('Required').nullable(),
            date: Yup.string().required('Required').nullable(),
            time: Yup.string().required('Required').nullable(),
            payment_type: Yup.string().required('Required').nullable(),
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
              {values.services.map((service, index) => (
                <div key={index}>
                  <Form.Group className="mb-3">
                    <ServiceStylist 
                      type="add"
                      index={index}
                      service={service}
                      onRemove={() => setFieldValue('services', values.services.filter((_, _index) => _index !== index))}
                      onChange={value => {
                        const services = [...values.services];
                        services[index] = value;
                        setFieldValue('services', services);
                        setFieldValue('total_amount', services.reduce((o, c) => o + parseInt(c.amount), 0));
                      }}
                    />
                    <Form.Control 
                      type="hidden"
                      className={errors.services?.[index]?.service_id && touched.services?.[index]?.service_id && 'is-invalid'}
                    />
                    {errors.services?.[index]?.service_id && touched.services?.[index]?.service_id && <div className="invalid-feedback">{errors.services?.[index]?.service_id}</div>}
                  </Form.Group>
                </div>
              ))}
              {values.services.length !== 2 ? (
                <div className="d-flex justify-content-center">
                  <Button 
                    size="sm"
                    onClick={() => setFieldValue('services', [ ...values.services, { service_id: '', stylist_id: '', amount: 0 }])}
                    disabled={values.services.length === 2}
                  >
                    Add  Service
                  </Button>
                </div>
              ) : null}
              <Form.Group className="mb-3">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  readOnly 
                  type="text"
                  value={values.total_amount}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  min={moment().format("YYYY-MM-DD")}
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.date && touched.date && 'is-invalid'}
                />
                {errors.date && touched.date && <div className="invalid-feedback">{errors.date}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.time && touched.time && 'is-invalid'}
                >
                  <option value="">Select Time</option>
                  {generateHourArray().map(time => <option key={time} value={time}>{time}</option>)}
                </Form.Select>
                {errors.time && touched.time && <div className="invalid-feedback">{errors.time}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment Type</Form.Label>
                <Form.Select
                  name="payment_type"
                  value={values.payment_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.payment_type && touched.payment_type && 'is-invalid'}
                >
                  <option value="">Select Payment Type</option>
                  <option value="Reservation" disabled={values.total_amount <= 100 ? true : false}>Reservation</option>
                  <option value="Paid in Full">Paid in Full</option>
                </Form.Select>
                {errors.payment_type && touched.payment_type && <div className="invalid-feedback">{errors.payment_type}</div>}
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
  const [updateAppointment] = useUpdateServicesAndScheduleMutation();
  const [show, setShow] = useState(false);

  const submit = async (values, callback, setErrors) => {
    const { date, time, services } = values;
    try {
      const response = await updateAppointment({ id: item.id, data: { services, schedule: `${date} ${time}` } }).unwrap();
      setShow(false);
      antMessage.success(response.message);
      callback();
    } catch(error) {
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
      callback();
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const generateHourArray = () => {
    const hours = [];
    for (let hour = 8; hour <= 21; hour++) {
      hours.push(`${hour}:00:00`);
    }
    return hours;
  };

  return (
    <>
      <Button 
        size="sm"
        className="m-1"
        variant="info"
        onClick={() => setShow(true)}
      >
        <FaCalendar />  
      </Button>
      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: item.name,
            services: item.appointment_stylist_service.map(service => ({ service_id: service.service_id, stylist_id: service.stylist_id, amount: service.service
.fee })),
            date: moment(item.schedule).format('YYYY-MM-DD'),
            time: moment(item.schedule).format('HH:mm:ss'),
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Required').nullable(),
            services: Yup.array()
            .of(Yup.object().shape({
                service_id: Yup.string().required('Required'),
                stylist_id: Yup.string().required('Required'),
                amount: Yup.string().required('Required'),
              }))
            .required('Required'),
            date: Yup.string().required('Required').nullable(),
            time: Yup.string().required('Required').nullable(),
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
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.name && touched.name && 'is-invalid'}
                  readOnly
                />
                {errors.name && touched.name && <div className="invalid-feedback">{errors.name}</div>}
              </Form.Group>
              {values.services.map((service, index) => (
                <div key={index}>
                  <Form.Group className="mb-3">
                    <ServiceStylist
                      type="edit" 
                      index={index}
                      service={service}
                      onRemove={() => setFieldValue('services', values.services.filter((_, _index) => _index !== index))}
                      onChange={value => {
                        const services = [...values.services];
                        services[index] = value;
                        setFieldValue('services', services);
                        setFieldValue('total_amount', services.reduce((o, c) => o + parseInt(c.amount), 0));
                      }}
                    />
                    <Form.Control 
                      type="hidden"
                      className={errors.services?.[index]?.service_id && touched.services?.[index]?.service_id && 'is-invalid'}
                    />
                    {errors.services?.[index]?.service_id && touched.services?.[index]?.service_id && <div className="invalid-feedback">{errors.services?.[index]?.service_id}</div>}
                  </Form.Group>
                </div>
              ))}
              <Form.Group className="mb-3">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  readOnly 
                  type="text"
                  value={values.total_amount}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  min={moment().format("YYYY-MM-DD")}
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.date && touched.date && 'is-invalid'}
                />
                {errors.date && touched.date && <div className="invalid-feedback">{errors.date}</div>}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.time && touched.time && 'is-invalid'}
                >
                  <option value="">Select Time</option>
                  {generateHourArray().map(time => <option key={time} value={time}>{time}</option>)}
                </Form.Select>
                {errors.time && touched.time && <div className="invalid-feedback">{errors.time}</div>}
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
                {isSubmitting ? 'Please wait...' : 'Update'}
              </Button>
            </Modal.Footer>
          </Form>
         )}
        </Formik>
      </Modal>
    </>
  );
}

function Verified({ item, antMessage }) {
  const [updateAppointment] = useUpdateAppointmentMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="success"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Verify Appointment', confirmation: 'Are you sure you want to continue this action?' })) {
          const response = await updateAppointment({ id: item.id, data: { ...item, status: 'Verified'  } }).unwrap();
            antMessage.success(response.message);
          }
        } catch (error) {
          antMessage.error(JSON.stringify(error.data));
        }
      }}
    >
      <FaCheck />
    </Button>
  )
}

function Done({ item, antMessage }) {
  const [updateAppointment] = useUpdateAppointmentMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="success"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Done Appointment', confirmation: 'Are you sure you want to continue this action?' })) {
            const response = await updateAppointment({ id: item.id, data: { ...item, status: 'Done'  } }).unwrap();
            antMessage.success(response.message);
          }
        } catch (error) {
          antMessage.error(JSON.stringify(error.data));
        }
      }}
    >
      <FaCheck />
    </Button>
  )
}

function Delete({ item, antMessage }) {
  const [deleteAppointment] = useDeleteAppointmentMutation();

  return (
    <Button 
      size="sm"
      className="m-1"
      variant="danger"
      onClick={async () => {
        try {
          if (await confirm({ title: 'Delete Item', confirmation: 'Are you sure you want to delete this item?' })) {
            const response = await deleteAppointment({ id: item.id }).unwrap();
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

export { Verified, Done, Create, Edit, Delete };
