import { Modal, Button, Form, FormControl, Grid, TextInput, Textarea, Stack, Radio, ModalControls } from '@contentful/f36-components';
import React from 'react';
import useMethods from 'use-methods';
import { css } from 'emotion';
import { FlagTypes } from './constants';
const CONTENTFUL = 'contentful';

const styles = {
   fieldItem: css({
      marginBottom: '20px'
   })
}

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

function CreateFeatureFlagModal(props) {

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
      await props.onModalClose(featureFlagCreated);
      actions.setLoading(false);
   }
   const isDisabled = !state.flagName.length;
  return (
    <React.Fragment>
      <Modal onClose={() => props.onModalClose('')} isShown={props.isShown} size='medium'>
         {() => (
         <>
            <Modal.Header
               title="Create Feature Flag"
               onClose={() => props.onModalClose('')}
            />
            <Modal.Content>
               <Form onSubmit={createFeatureFlag}>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label isRequired>Flag name</FormControl.Label>
                     <TextInput
                        value={state.flagName}
                        maxLength='255'
                        onChange={(e) => actions.setFlagName(e.target.value)}/>
                     <Grid columns="auto 80px">
                        <FormControl.HelpText>
                           Name should be no longer than 255 characters
                        </FormControl.HelpText>
                        <FormControl.Counter />
                     </Grid>
                  </FormControl>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label>Description</FormControl.Label>
                     <Textarea
                        value={state.description}
                        maxLength='300'
                        onChange={(e) => actions.setDescription(e.target.value)}/>
                     <Grid columns="auto 80px">
                        <FormControl.HelpText>
                           Description should be no longer than 300 characters
                        </FormControl.HelpText>
                        <FormControl.Counter />
                     </Grid>
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
               </Form>
            </Modal.Content>
            <ModalControls>
            <Button
                size="small"
                variant="transparent"
                onClick={() => props.onModalClose('')}
              >
               Close
              </Button>
              <Button
                size="small"
                variant="positive"
                isDisabled={isDisabled}
                isLoading={state.loading}
                onClick={createFeatureFlag}
              >
               Create
              </Button>
            </ModalControls>
         </>
         )}
      </Modal>
    </React.Fragment>
  )
}

export default CreateFeatureFlagModal;