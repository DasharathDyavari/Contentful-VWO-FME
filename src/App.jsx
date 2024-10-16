import React, {useEffect, useState} from 'react';
import { locations } from '@contentful/app-sdk';
import ConfigScreen from './locations/ConfigScreen';
import Field from './locations/Field';
import EntryEditor from './locations/EntryEditor';
import Dialog from './locations/Dialog';
import VwoClient from './vwo-client';
import Sidebar from './locations/Sidebar';
import tokens from '@contentful/f36-tokens';
import ConnectButton from './ConnectButton';
import Page from './locations/Page';
import Home from './locations/Home';
import { Modal, Flex, Heading, Paragraph, FormControl, Button, Text, TextInput, TextLink } from '@contentful/f36-components';
import { css } from 'emotion';
import { validateCredentials } from './utils';

const ComponentLocationSettings = {
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
  [locations.LOCATION_ENTRY_FIELD]: Field,
  [locations.LOCATION_ENTRY_EDITOR]: EntryEditor,
  [locations.LOCATION_DIALOG]: Dialog,
  [locations.LOCATION_ENTRY_SIDEBAR]: Sidebar,
  [locations.LOCATION_PAGE]: Page,
  [locations.LOCATION_HOME]: Home,
};

const styles = {
  formItem: css({
    marginTop: tokens.spacingXs
  })
}

const App = (props) => {

  const makeClient = (params) => {
    return new VwoClient(params);
  };

  const openAuth = () => {
    let newState = {...state};
    newState.showAuth = true;
    setState(newState);
  }

  const [loading, setLoading] = useState(false);
  const [state,setState] = useState({
    client: null,
    accessToken: props.sdk.parameters.installation.accessToken || '',
    showAuth: false,
    accountId: props.sdk.parameters.installation.accountId || ''
  });

  const validateUserCredentials = async (props) => {
    const apiToken = props.sdk.parameters.installation.accessToken;
    const vwoAccountId = props.sdk.parameters.installation.accountId;
    const areCredentialsValid = await validateCredentials(vwoAccountId, apiToken);
    if(areCredentialsValid.code === 200 || areCredentialsValid.code === 429){
      const params = {
        authToken: apiToken,
        accountId: vwoAccountId,
        onReauth: openAuth
      }
      setState({
        client: makeClient(params),
        accessToken: apiToken,
        accountId: vwoAccountId,
        showAuth: false
      });
    }
    else{
      setState({
        client: null,
        accessToken: '',
        accountId: state.accountId,
        showAuth: !props.sdk.location.is(locations.LOCATION_APP_CONFIG)
      });
    }
  }

  const updateCredentials = (credentials) => {
    if(!credentials.token || !credentials.accountId){
      return;
    }
    let params = {
      authToken: credentials.token,
      accountId: credentials.accountId,
      onReauth: openAuth
    };
    setState({
      client: makeClient(params),
      accessToken: credentials.token,
      accountId: credentials.accountId,
      showAuth: false
    });
  }

  const connectToVwo = async () => {
    setLoading(true);
    const areCredentialsValid = await validateCredentials(state.accountId, state.accessToken);
    if(areCredentialsValid){
      updateCredentials({
        accountId: state.accountId,
        token: state.accessToken
      });
      props.sdk.notifier.success("Successfully connected to VWO.");
    }
    else{
      props.sdk.notifier.error("Something went wrong. Please check the credentials properly and try again.");
    }
    setLoading(false)
    return areCredentialsValid;
  }

  const updateAccountId = (value) => {
    let newState = {...state};
    newState.accountId = value;
    setState(newState);
  }

  const updateAuthToken = (value) => {
    let newState = {...state};
    newState.accessToken = value;
    setState(newState);
  }

  useEffect(() => {
    validateUserCredentials(props);
  },[]);

  if(state.showAuth){
    return <Modal isShown={true}>
      <Flex flexDirection='column'>
        <Heading marginBottom='spacingXl'>Configuration</Heading>
        <FormControl className={styles.formItem}>
            <FormControl.Label isRequired>Account ID</FormControl.Label>
            <TextInput
              value={state.accountId}
              onChange={(e) => updateAccountId(e.target.value)}/>
        </FormControl>
        <FormControl className={styles.formItem}>
            <FormControl.Label isRequired>API Key</FormControl.Label>
            <TextInput
              value={state.accessToken}
              onChange={(e) => updateAuthToken(e.target.value)}/>
        </FormControl>
        <Paragraph>You can find the auth token in Integrations &gt; Contentful &gt; Config section in VWO app. For more details, <TextLink href='https://help.vwo.com/hc/en-us/articles/4404205211929-Integrating-VWO-With-Contentful' target='_blank' rel="noopener noreferrer">click here.</TextLink></Paragraph>
        <Paragraph>Please note that this token would have read-only(browse) level permissions to your organization level information stored in VWO, which can be accessed via API calls by any user in the current Contentful space.</Paragraph>
        <ConnectButton openAuth={connectToVwo} loading={loading}/>
      </Flex>
    </Modal>
  }

  // Perform conditional rendering based on location
  if (props.sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    return (
      <EntryEditor
        sdk={props.sdk}
        client={state.client}
        openAuth={openAuth}
      />
    );
  } else if (props.sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    return <Sidebar sdk={props.sdk} client={state.client}/>;
  }

  // Handle other locations here...
  if (props.sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    return (
      <ConfigScreen
        openAuth={openAuth}
        accessToken={state.accessToken}
        accountId={state.accountId}
        updateCredentials={updateCredentials}
        sdk={props.sdk}
        client={state.client}
      />
    );
  }

  return null;
};

export default App;