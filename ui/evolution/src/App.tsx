import React, { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './App.css';
<link rel="stylesheet" href="bower_components/aos/dist/aos.css" />
import AppRoutes from './routes';

const App: React.FC = () => {
  useEffect(() => {
    Aos.init({
      // offset: 200,
      duration: 2000,
      once: true,
    });
  }, []);

  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
