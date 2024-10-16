import { Card, Heading, Box, Text, Paragraph, IconButton, Flex, Grid, Subheading, Tooltip } from '@contentful/f36-components';
import { Modal, Button, Form, FormControl, TextInput, Textarea, Stack, Radio, ModalControls } from '@contentful/f36-components';
import React, {useEffect, useState} from 'react';
import useMethods from 'use-methods';
import { FlagTypes } from './constants';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { PlusIcon, EditIcon, HelpCircleIcon } from '@contentful/f36-icons';
import EditFeatureFlagModal from './EditFeatureFlagModal';
import SectionSplitter from './SectionSplitter';
const CONTENTFUL = 'contentful';


const styles = {
   flexContainer: css({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: tokens.spacingL
   }),
   container: css({
      width: '800px'
   }),
   tile: css({
      width: '600px',
      height: '150px',
      border: '1px solid lightgrey',
      borderRadius: '10px'
   }),
   editIcon: css({
      position: 'absolute',
      right: '0px',
      top: '0px'
   }),
   fieldItem: css({
      marginBottom: '10px'
   }),
   button: css({
      marginTop: tokens.spacingL
   })
 };

const initialData = ({
   flagName: '',
   description: '',
   loading: false,
   type: FlagTypes.TEMPORARY
 });

 const methods = state => {
   return {
      setFlagName(flagName){
         state.flagName = flagName;
      },
      setDescription(description){
         state.description = description;
      },
      setType(type){
         state.type = type;
      },
      setLoading(loading){
         state.loading = loading;
      }
   }
 }

function FeatureFlag(props) {

   const globalState = useMethods(methods,initialData);
   const [state, actions] = globalState;

   const createFeatureFlag = async () => {
      actions.setLoading(true);
      const featureFlagCreated = {
         name: state.flagName,
         featureKey: `${CONTENTFUL}_${props.entryId}`,
         description: state.description,
         featureType: state.type,
         variables: []
      };
      await props.onFeatureFlagCreation(featureFlagCreated);
      actions.setLoading(false);
   }

   const isDisabled = !state.flagName.length;
   
  return (
    <React.Fragment>
      <div className={styles.container}>
         <Flex alignItems='center'>
            <Heading element='h1' marginBottom='0px' marginRight='spacingXs'>Create new feature flag</Heading>
            <Tooltip placement='top' content='incomplete'>
               <HelpCircleIcon variant='muted'/>
            </Tooltip>
         </Flex>
         <Subheading>Feature flags let you control and test different variations of your content.</Subheading>
         <SectionSplitter />
         <Form onSubmit={createFeatureFlag}>
            <FormControl className={styles.fieldItem}>
               <FormControl.Label isRequired>Flag name</FormControl.Label>
               <TextInput
                  value={state.flagName}
                  maxLength='255'
                  onChange={(e) => actions.setFlagName(e.target.value)}/>
               <FormControl.Counter />
            </FormControl>
            <FormControl className={styles.fieldItem}>
               <FormControl.Label>Description</FormControl.Label>
               <Textarea
                  value={state.description}
                  maxLength='300'
                  onChange={(e) => actions.setDescription(e.target.value)}/>
               <FormControl.Counter />
            </FormControl>
            <FormControl className={styles.fieldItem}>
               <FormControl.Label>Feature type</FormControl.Label>
               <Stack flexDirection='row'>
                  <Radio
                     id='flag-type1'
                     name='flag-type'
                     value={FlagTypes.TEMPORARY}
                     isChecked={state.type === FlagTypes.TEMPORARY}
                     onChange={() => actions.setType(FlagTypes.TEMPORARY)}>Temporary</Radio>
                  <Radio
                     id='flag-type2'
                     name='flag-type'
                     value={FlagTypes.PERMANENT}
                     isChecked={state.type === FlagTypes.PERMANENT}
                     onChange={() => actions.setType(FlagTypes.PERMANENT)}>Permanent</Radio>
               </Stack>
            </FormControl>
            <Button variant='primary' size='small' onClick={createFeatureFlag} isDisabled={isDisabled} isLoading={state.loading} className={styles.button}>Create feature flag</Button>
         </Form>
      </div>
    </React.Fragment>
  )
}

export default FeatureFlag;