import React, {useState, useEffect} from 'react';
import { Heading, Select } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK();
  return (
    <React.Fragment>Hello Field</React.Fragment>
  )
};

export default Field;
