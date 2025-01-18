import React, { useContext } from 'react';
import { Context } from '../store/appContext';
import rigoImageUrl from '../../img/rigo-baby.jpg';
import Paragraph from '../component/html/Paragraph';

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="text-center mt-5">
      <h1>Hello Rigo!!</h1>
      <Paragraph>
        <img src={rigoImageUrl} />
      </Paragraph>
      <div className="alert alert-info">
        {store.message ||
          'Loading message from the backend (make sure your python backend is running)...'}
      </div>
      <Paragraph className="xd" textColor="primary">
        This boilerplate comes with lots of documentation:{' '}
        <a href="https://start.4geeksacademy.com/starters/react-flask">
          Read documentation
        </a>
      </Paragraph>
    </div>
  );
};
