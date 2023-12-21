import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useGetServicesQuery } from 'src/redux/services/services';

function Services({ getOptionValue = null, ...props }) {
  const { data, error, isLoading, isFetching, refetch } = useGetServicesQuery({
    search: '',
    page: 1,
    per_page: 1000,
  });

  useEffect(() => {
    const value = (data?.data || []).find(item => item.id === parseInt(props.value));
    if (value && getOptionValue) {
      getOptionValue(value);
    }
  }, [props.value]);

  return (
    <Form.Select
      {...props}
    >
      <option value="">Select...</option>
       {(data?.data || []).map(item => <option value={item.id}>{item.name}</option>)}
    </Form.Select>
  )
}

export default Services;