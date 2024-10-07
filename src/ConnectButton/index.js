import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Button, Flex } from '@contentful/f36-components';

const styles = {
  connect: css({
    width: '250px',
    height: '40px',
    backgroundColor: 'rgb(226, 0, 114)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '20px'
  })
};

export default function ConnectButton({ openAuth, loading=false }) {
  return (
    <Flex alignItems='center' justifyContent='center' marginTop='spacingS'>
      <Button
        className={styles.connect}
        onClick={openAuth}
        isLoading={loading}
        testId="connect-button">
          Connect with VWO
      </Button>
    </Flex>
  );
}

ConnectButton.propTypes = {
  openAuth: PropTypes.func.isRequired
};
