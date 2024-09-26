import React from 'react';
import ReactDom from 'react-dom';
import { locations } from '@contentful/app-sdk';

import EntryEditor from './locations/EntryEditor';
import VwoClient from './vwo-client';
import Sidebar from './locations/Sidebar';

export default class App extends React.Component {
  constructor(props){
    super(props);

    const token = window.localStorage.getItem('TOKEN_KEY');
    const expires = window.localStorage.getItem('TOKEN_EXPIRATION');

    this.state = {
      client: token? this.makeClient(token): ''
    }
  }

  makeClient = token => {
    return new VwoClient({
      authToken: token,
      onReath: () => {
        this.setState({ client: null });
      }
    });
  }

  render(){
    if(this.props.sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)){
      return (
        <Sidebar sdk={this.props.sdk}/>
      )
    }

    if(this.props.sdk.location.is(locations.LOCATION_ENTRY_EDITOR)){
      return (
        <EntryEditor sdk={this.props.sdk}/>
      );
    }
  }
}