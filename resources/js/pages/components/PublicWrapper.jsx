import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from 'src/assets/logo.png';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './PublicWrapper.scss';

function PublicWrapper({ children, bodyClass = '' }) {
  return (
    <>
      <Helmet>
        <body className={bodyClass} />
      </Helmet>
      <div>
        {children}
      </div>
    </>
  );
}

export default PublicWrapper;