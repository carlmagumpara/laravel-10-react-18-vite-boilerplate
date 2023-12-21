import { Form } from 'react-bootstrap';
import { useGetStylistPositionsQuery } from 'src/redux/services/stylist-positions';

function StylistPosition({ type = 'positions', serviceId = '', ...props }) {
  const { data, error, isLoading, isFetching, refetch } = useGetStylistPositionsQuery({
    search: '',
    page: 1,
    per_page: 1000,
  });

  if (type === 'stylists') {
    const stylists = (data?.data || []).filter(item => item.services.find(service => service.id === parseInt(serviceId)) ? true : false);

    return (
      <Form.Select
        {...props}
        disabled={!serviceId}
      >
        <option value="">Select...</option>
        {(stylists?.[0]?.stylists || []).map(item => <option value={item.id}>{item.first_name}</option>)}
      </Form.Select>
    )
  }

  return (
    <Form.Select
      {...props}
    >
      <option value="">Select...</option>
       {(data?.data || []).map(item => <option value={item.id}>{item.name}</option>)}
    </Form.Select>
  )
}

export default StylistPosition;