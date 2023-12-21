import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Table, InputGroup, Nav } from 'react-bootstrap';
import { Create } from './Actions';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useGetAppointmentServicesQuery } from 'src/redux/services/appointments';
import moment from 'moment';
import Loader from 'src/shared/loader';

function Index() {
  const { data, error, isLoading, isFetching, refetch } = useGetAppointmentServicesQuery({
    search: '',
    page: 1,
    per_page: 30,
  });

  useEffect(() => {
    refetch();
  }, []);

  const renderEventContent = (eventInfo) => {

    console.log('eventInfo', eventInfo.event);

    return (
      <div className="w-100" onClick={eventInfo.event.onClick}>
        <div className="w-100">
          <b>{eventInfo.timeText}</b>
        </div>
        <div className="w-100">
          <i>{eventInfo.event.title}</i>
        </div>
      </div>
    )
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Appointments &gt; Calendar</h2>
        <div>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link as={Link} to="/appointments/list">Appointments</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/appointments/calendar">Calendar</Nav.Link>
            </Nav.Item>
            <Create />
          </Nav>
        </div>
      </div>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : (isLoading || isFetching) ? (
        <Loader />
      ) : data ? (
        <FullCalendar
          headerToolbar={{
            start: "today prev next",
            end: "dayGridMonth timeGridWeek",
          }}
          plugins={[dayGridPlugin, timeGridPlugin]}
          views={["dayGridWeek", "dayGridMonth", "dayGridDay"]}
          initialView="timeGridWeek"
          events={data.data.map(item => ({
            title: item.service.name,
            description: `${item.appointment.name}`,
            date: moment(item.appointment.schedule).format('YYYY-MM-DD'),
            start: moment(item.appointment.schedule).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(item.appointment.schedule).add(item.service.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            onClick: () => alert('wow')
          }))}
          eventRender={info => console.log(info)}
          eventContent={renderEventContent}
        />
      ) : null}
    </Container>
  )
}

export default Index;