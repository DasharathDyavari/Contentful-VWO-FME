import { Modal, Button, Form, FormControl, TextInput, Textarea, Stack, Radio, ModalControls, EntryCard, MenuItem } from '@contentful/f36-components';
import React from 'react';
import { mapVwoVariationsAndContent } from '../utils';
import useMethods from 'use-methods';
import CreateContent from './CreateContent';
import { css } from 'emotion';

const FlagTypes = {
   TEMPORARY: 'temporary',
   PERMANENT: 'permanent'
};

const styles = {
   fieldItem: css({
      marginBottom: '20px'
   })
}

const initialData = ({
   step: 1,
   flagName: '',
   featureKey: '',
   description: '',
   type: FlagTypes.TEMPORARY,
   contentId: '',
   variable: '',
   manualEdit: false
 });

 const methods = state => {
   return {
      setStep(step){
         state.step = step;
      },
      setVariable(variable){
         state.variable = variable;
      },
      setFlagName(flagName){
         state.flagName = flagName;
      },
      setFeatureKey(featureKey){
         state.featureKey = featureKey;
      },
      setDescription(description){
         state.description = description;
      },
      setType(type){
         state.type = type;
      },
      setContentId(id){
         state.contentId = id;
      },
      setManuallyTyped(manualEdit){
         state.manualEdit = manualEdit
      }
   }
 }

function CreateFeatureFlagModal(props) {

   const globalState = useMethods(methods,initialData);
   const [state, actions] = globalState;

   const generateKeyFromFlagName = (flagName) => {
      return flagName.split(' ').map(word => word.toLowerCase()).map((word,index) => index? word.charAt(0).toUpperCase() + word.slice(1): word).join('');
   }

   const onFlagNameChange = (value) => {
      actions.setFlagName(value);
      if(!state.featureKey || !state.manualEdit){
         actions.setManuallyTyped(false);
         actions.setFeatureKey(generateKeyFromFlagName(value));
      }
   }

   const createFeatureFlag = () => {
      if(state.step == 1){
         actions.setStep(2);
      } else{
         const featureFlagCreated = {
            name: state.flagName,
            featureKey: state.featureKey,
            description: state.description,
            featureType: state.type,
            id: props.sdk.ids.entry // Replace this id with contentful id
         };
         props.onModalClose(featureFlagCreated);
      }
   }
   const mappedVariation = mapVwoVariationsAndContent([props.vwoVariation], props.entries, props.contentTypes, props.sdk.locales.default)[0];
   let isDisabled = false;
   if(state.step == 2) {
      isDisabled = !state.variable || mappedVariation.vwoVariation?.jsonContent?.value == 'notSet';
   } else{
      isDisabled = (!state.flagName.length || !state.featureKey.length);
   }

  return (
    <React.Fragment>
      <Modal onClose={() => props.onModalClose('')} isShown={props.isShown} size='medium'>
         {() => (
         <>
            <Modal.Header
               title={state.step == 1?  "Create Feature Flag": 'Create Variable'}
               onClose={() => props.onModalClose('')}
            />
            <Modal.Content>
               {state.step == 1 && <Form onSubmit={createFeatureFlag}>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label isRequired>Flag name</FormControl.Label>
                     <TextInput
                        value={state.flagName}
                        onChange={(e) => onFlagNameChange(e.target.value)}/>
                  </FormControl>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label isRequired>Feature key</FormControl.Label>
                     <TextInput
                        value={state.featureKey}
                        onChange={(e) => {actions.setFeatureKey(e.target.value); actions.setManuallyTyped(true)}}/>
                  </FormControl>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label>Description</FormControl.Label>
                     <Textarea
                        value={state.description}
                        onChange={(e) => actions.setDescription(e.target.value)}/>
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
               </Form>}
               {state.step == 2 && <Form onSubmit={createFeatureFlag}>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label>Variable name</FormControl.Label>
                     <TextInput
                        value={state.variable}
                        onChange={(e) => actions.setVariable(e.target.value)}/>
                  </FormControl>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label marginBottom='spacingL'>Variable content</FormControl.Label>
                     <CreateContent
                        sdk={props.sdk}
                        variation={mappedVariation}
                        contentTypes={props.contentTypes}
                        canRemoveContent={true}
                        linkExistingEntry={props.linkExistingEntry}
                        onCreateEntry={props.onCreateVariation}
                        updateVwoVariationContent={props.updateVwoVariationContent}
                        removeContent={props.removeContent}/>
                  </FormControl>
               </Form>}
            </Modal.Content>
            <ModalControls>
            <Button
                size="small"
                variant="transparent"
                onClick={() => state.step == 2? actions.setStep(1): props.onModalClose()}
              >
                {state.step == 1? 'Close': 'Back'}
              </Button>
              <Button
                size="small"
                variant="positive"
                isDisabled={isDisabled}
                onClick={createFeatureFlag}
              >
                {state.step == 1? 'Next': 'Create'}
              </Button>
            </ModalControls>
         </>
         )}
      </Modal>
    </React.Fragment>
  )
}

export default CreateFeatureFlagModal;