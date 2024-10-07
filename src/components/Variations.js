import { Flex, Button, Heading, Paragraph, Modal, Form, FormControl, TextInput, ModalControls, Tooltip } from '@contentful/f36-components';
import { css } from 'emotion';
import { PlusIcon } from '@contentful/f36-icons';
import { mapVwoVariationsAndContent } from '../utils';
import React, {useEffect, useState} from 'react';
import VariationItem from './VariationItem';

const styles = {
   heading: css({
      marginBottom: '10px'
   }),
   container: css({
    width: '100%'
   })
}

function Variations(props) {
  const [newVariationModal, setNewVariationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variationName, setVariationName] = useState(`Variation-${props.vwoVariations.length}`);

  const addVwoVariationModal = async (name) => {
    if(name){
      setLoading(true);
      const isVariationAdded = await props.addNewVwoVariation(name);
      if(isVariationAdded){
        setVariationName('');
        setNewVariationModal(false);
      }
      setLoading(false);
    }
    else{
      setNewVariationModal(false);
    }
  }

  const updateVwoVariationsName = (length) => {
    setVariationName(`Variation-${length}`)
  }

  useEffect(() => {
    updateVwoVariationsName(props.vwoVariations.length);
  },[props.vwoVariations]);

  const mappedVariations = mapVwoVariationsAndContent(props.vwoVariations, props.entries, props.contentTypes, props.sdk.locales.default);
  console.log('props: ',props)
  const isDefaultVariationAdded = props.vwoVariations[0]?.jsonContent.length && props.vwoVariations[0].jsonContent[0].value;
  return (
    <React.Fragment>
      <Modal onClose={() => addVwoVariationModal('')} isShown={newVariationModal} size='medium'>
      {() => (
         <>
            <Modal.Header
               title="Create new VWO Variation"
               onClose={() => addVwoVariationModal('')}
            />
            <Modal.Content>
               <Form onSubmit={() => addVwoVariationModal(variationName)}>
                  <FormControl className={styles.fieldItem}>
                     <FormControl.Label isRequired>Variation name</FormControl.Label>
                     <TextInput
                        value={variationName}
                        onChange={(e) => setVariationName(e.target.value)}/>
                  </FormControl>
               </Form>
            </Modal.Content>
            <ModalControls>
              <Button
                size="small"
                variant="transparent"
                onClick={() => addVwoVariationModal('')}
              >
               Close
              </Button>
              <Button
                size="small"
                variant="positive"
                isLoading={loading}
                onClick={() => addVwoVariationModal(variationName)}
              >
               Add
              </Button>
            </ModalControls>
         </>
         )}
      </Modal>
      <Heading element='h2' className={styles.heading}>Variations:</Heading>
      <Paragraph>Content created in this feature flag is available only for this feature flag</Paragraph>
      <Flex flexDirection='column' justifyContent='center' marginLeft='spacingM' marginTop='spacingL' marginBottom='spacingXl' gap='spacingXl' className={styles.container}>
        {mappedVariations.map(variation => {
            return <VariationItem
              sdk={props.sdk}
              variation={variation}
              isDefaultVariationAdded={isDefaultVariationAdded}
              linkExistingEntry={props.linkExistingEntry}
              contentTypes={props.contentTypes}
              onCreateVariationEntry={props.onCreateVariationEntry}
              updateVwoVariationContent={props.updateVwoVariationContent}
              key={variation.vwoVariation.id}/>
        })}
      </Flex>
      <Tooltip placement="top" id="tooltip-1" content="Add content to default variation in order to add more variations" isDisabled={isDefaultVariationAdded}>
        <Button variant='primary' size='small' startIcon={<PlusIcon />} onClick={() => setNewVariationModal(true)} isDisabled={!isDefaultVariationAdded}>Add Variation</Button>
      </Tooltip>
    </React.Fragment>
  )
}

export default Variations;