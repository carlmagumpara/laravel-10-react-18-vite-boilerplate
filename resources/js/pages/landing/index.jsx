import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';

function Index() {
  const auth = useAuth();

  console.log('auth', auth);

  return <p>Welcome to Landing Page</p>;
}

export default Index;