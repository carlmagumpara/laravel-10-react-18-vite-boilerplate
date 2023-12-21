import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function Pagination({ 
  data, 
  page, 
  loading, 
  onPageClick 
}) {
  const [state, setState] = useState({
    entities: data,
    offset: 4,
  });

  const changePage = page => onPageClick(page);

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      entities: data,
    }));
  }, [data]);

  const pagesNumbers = () => {
    if (!state.entities.to) {
      return [];
    }
    let from = state.entities.current_page - state.offset;
    if (from < 1) {
      from = 1;
    }
    let to = from + (state.offset * 2);
    if (to >= state.entities.last_page) {
      to = state.entities.last_page;
    }
    let pages_array = [];
    for (let page = from; page <= to; page++) {
      pages_array.push(page);
    }
    return pages_array;
  }

  const pageList = () => {
    return pagesNumbers().map(_page => {
      return (
        <li className={_page === state.entities.current_page ? 'page-item active' : 'page-item'} key={_page}>
          <Button 
            size="sm" 
            className="page-link m-1"
            disabled={loading} 
            onClick={() => changePage(_page)}
          >
            {_page}
          </Button>
        </li>
      )
    })
  };

  return (
    <div className="d-flex justify-content-end align-items-center">
      <ul className="pagination">
        <li className="page-item">
          <Button
            size="sm" 
            variant="link"
            className="m-1"
            disabled={(state.entities.current_page === 1 || loading)}
            onClick={() => changePage(state.entities.current_page - 1)}>
            Previous
          </Button>
        </li>
        {pageList()}
        <li className="page-item">
          <Button
            size="sm" 
            variant="link"
            className="m-1"
            disabled={(state.entities.last_page === state.entities.current_page || loading)}
            onClick={() => changePage(state.entities.current_page + 1)}>
            Next
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default Pagination;