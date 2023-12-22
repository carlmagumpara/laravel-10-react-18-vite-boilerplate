import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Pagination, Table, Dropdown } from 'react-bootstrap';
import { useGetDashboardQuery } from 'src/redux/services/dashboard';
import { useNavigate } from 'react-router-dom';
import Loader from 'src/shared/loader';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { camelCase } from 'src/helpers/utils';

Chart.register(...registerables);

function Index() {
  const navigate = useNavigate();
  const { data, error, isLoading, isFetching, refetch } = useGetDashboardQuery({});
  const [chart_view, setChartView] = useState('by_week')
  const [chart, setChart] = useState(false);

  useEffect(() => {
    refetch();
    setChart(true);

    return () => setChart(false);
  }, []);

  return (
    <Container>
      <h2 className="mb-3">Dashboard</h2>
    </Container>
  );
}

export default Index;