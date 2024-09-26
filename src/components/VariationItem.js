import React, {useState} from 'react';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { PlusIcon, MinusIcon } from '@contentful/f36-icons';
import { Box, Button, EntryCard, Flex, IconButton, Menu, MenuItem, Stack, Subheading, TextLink } from '@contentful/f36-components';
import CreateContent from './CreateContent';

const styles = {
   subheading: css({
      marginBottom:  '0px',
      marginRight: 'tokens.spacingS'
   }),
   flexItem: css({
      marginBottom:  '-15px'
   }),
   removeIconCircle: css({
      border: '1px solid lightgrey',
      borderRadius: '5px',
      height: '10px',
      width: '25px'
   })
 };
 
function VariationItem(props) {
   const canRemoveVariation = props.variationsCount > 1 && (props.canRemoveContent || props.variation.vwoVariation.jsonContent.value == 'notSet');
  return (
    <React.Fragment>
      <Flex alignItems='center' className={styles.flexItem}>
         <Subheading className={styles.subheading}>{props.variation.vwoVariation.name}</Subheading>
         {canRemoveVariation && <Button variant="transparent" onClick={() => props.removeVwoVariation(props.variation.vwoVariation.id)}>
            <Flex alignItems='center' justifyContent='center' className={styles.removeIconCircle}>
               <MinusIcon variant='negative' size='small'/>
            </Flex>
         </Button>}
      </Flex>
      <CreateContent 
         sdk={props.sdk}
         variation={props.variation}
         contentTypes={props.contentTypes}
         canRemoveContent={props.canRemoveContent}
         linkExistingEntry={props.linkExistingEntry}
         updateVwoVariationContent={props.updateVwoVariationContent}
         onCreateEntry={props.onCreateVariation}/>
    </React.Fragment>
  )
}

export default VariationItem;