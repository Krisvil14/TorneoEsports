import React, { useContext } from 'react';
import { Context } from '../store/appContext';
import { TEXT_COLOR_PRIMARY } from '../utils/constants';
import rigoImageUrl from '../../img/rigo-baby.jpg';
import Text from '../component/html/Text';
import Container from '../component/html/Container';

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <Container className="text-center mt-5">
      <Text as="h1">Hello Rigo!!</Text>
      <Text>
        <img src={rigoImageUrl} />
      </Text>
      <Container className="alert alert-info">
        {store.message ||
          'Loading message from the backend (make sure your python backend is running)...'}
      </Container>
      <Text className="xd" textColor={TEXT_COLOR_PRIMARY}>
        This boilerplate comes with lots of documentation:{' '}
        <Text
          as="a"
          href="https://start.4geeksacademy.com/starters/react-flask"
        >
          Read documentation
        </Text>
      </Text>
    </Container>
  );
};
