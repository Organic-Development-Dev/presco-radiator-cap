import { useContext, useEffect } from 'react';
import { AppContext } from '../components/context/AppContext';

function usePageAuth() {
  const {
    userInfo: { user, setUser },
  } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      window.location.replace('/my-account');
    }
  }, [user]);
}

export default usePageAuth;
