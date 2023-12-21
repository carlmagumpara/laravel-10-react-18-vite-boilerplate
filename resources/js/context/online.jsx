import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import Echo from 'src/helpers/echo';

const Context = createContext();

export const OnlineProvider = ({ children }) => {
  const auth = useAuth();
  const [online, setOnline] = useState([]);

  useEffect(() => {
    if (auth.getToken) {
      Echo(auth.getToken).join('global')
      .here(users => setOnline(users))
      .joining(user => setOnline(prevState => [...prevState, user]))
      .leaving(user => setOnline(prevState => prevState.filter(_user => _user.user_id !== user.user_id)));
    }
  }, [auth.getToken]);

  console.log('Online Now', online, auth.getToken);

  return (
    <Context.Provider
      value={online}
    >
      {children}
    </Context.Provider>
  );
};

export const useOnline = () => useContext(Context);