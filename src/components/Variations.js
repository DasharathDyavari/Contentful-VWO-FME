import { Flex, Button, Heading, List, MenuItem, Paragraph, Modal, Form, Menu, TextLink, FormControl, TextInput, ModalControls, Tooltip, Header, ButtonGroup } from '@contentful/f36-components';
import { css } from 'emotion';
import { mapVwoVariationsAndContent } from '../utils';
import React, {useEffect, useState} from 'react';
import VariationItem from './VariationItem';
import tokens from '@contentful/f36-tokens';
import CreateContent from './CreateContent';
import AddVwoVariationModal from '../modalComponents/AddVwoVariationModal';

const styles = {
   heading: css({
      marginBottom: '10px'
   }),
   container: css({
    width: '100%'
   }),
   DefaultVariationTile: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      border: '1px solid lightgrey',
      borderRadius: '10px'
   }),
   menuList: css({
    maxHeight: '200px'
  }),
  menuListHeader: css({
    marginLeft: tokens.spacingS,
    fontWeight: 'bold'
  }),
  variationsWithoutLength: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: tokens.spacingM
  }),
  variationsWithLength: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  })
}

function Variations(props) {
  const [newVariationModal, setNewVariationModal] = useState(false);

  const mappedVariations = mapVwoVariationsAndContent(props.vwoVariations, props.entries, props.contentTypes, props.sdk.locales.default);
  const isDefaultVariationContentAdded = mappedVariations[0].variationContent;
  console.log("hre: ",props)
  return (
    <React.Fragment>
      {/* Add Vwo Variation modal */}
      <AddVwoVariationModal
        addNewVwoVariation={props.addNewVwoVariation}
        setNewVariationModal={setNewVariationModal}
        vwoVariationsLength={props.vwoVariations.length}
        newVariationModal={newVariationModal}/>

      {/* Default variation block */}
      <div className={styles.DefaultVariationTile} style={{padding: mappedVariations[0].variationContent? '20px': '40px', marginBottom: '40px'}}>
         <Heading style={{marginBottom: '5px', alignSelf: mappedVariations[0].variationContent? 'flex-start': 'auto'}}>Default (control) variation</Heading>
         <Paragraph style={{marginBottom: '20px', alignSelf: mappedVariations[0].variationContent? 'flex-start': 'auto'}}>Wrapper & it’s entries associated with the default variation will be displayed here.</Paragraph>
         <CreateContent
          sdk={props.sdk}
          variation={mappedVariations[0]}
          contentTypes={props.contentTypes}
          linkExistingEntry={props.linkExistingEntry}
          updateVwoVariationContent={props.updateVwoVariationContent}/>
      </div>

      {/* Other variations block */}
      {isDefaultVariationContentAdded && <div className={styles.DefaultVariationTile} style={{padding: (mappedVariations.length > 1)? '20px': '40px'}}>
         <div className={mappedVariations.length > 1? styles.variationsWithLength: styles.variationsWithoutLength}>
            <div style={{marginBottom: '5px', display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: (mappedVariations.length > 1)? 'flex-start': 'center'}}>
              <Heading style={{marginBottom: '5px'}}>Other variation</Heading>
              <Paragraph style={{marginBottom: '20px'}}>Others Wrapper & it’s entries will be displayed here.</Paragraph>
            </div>
            <Button variant='primary' size='small' onClick={() => setNewVariationModal(true)}>Add Variation</Button>
         </div>
         {mappedVariations.length > 1 && <List style={{width: '100%', listStyle: 'none', padding: '0px'}}>
          {mappedVariations.slice(1).map((variation,index) => {
            return <List.Item key={variation.vwoVariation.id}>
              <VariationItem
                index={index+1}
                sdk={props.sdk}
                variation={variation}
                linkExistingEntry={props.linkExistingEntry}
                contentTypes={props.contentTypes}
                updateVwoVariationName={props.updateVwoVariationName}
                onCreateVariationEntry={props.onCreateVariationEntry}
                updateVwoVariationContent={props.updateVwoVariationContent}
                key={variation.vwoVariation.id}/>
            </List.Item>
          })}
         </List>
        }
      </div>}
    </React.Fragment>
  )
}

export default Variations;