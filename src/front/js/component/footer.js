import React, { Component } from 'react';
import Container from './html/Container';
import Text from './html/Text';

export const Footer = () => (
  <Container as="footer" className="footer mt-auto py-3 text-center">
    <Text>
      Made with <Text as="i" className="fa fa-heart text-danger" /> by{' '}
      <Text as="a" href="http://www.4geeksacademy.com">
        4Geeks Academy
      </Text>
    </Text>
  </Container>
);
