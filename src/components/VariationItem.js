import React from 'react';
import { css } from 'emotion';
import { Subheading } from '@contentful/f36-components';
import CreateContent from './CreateContent';

const styles = {
   subheading: css({
      marginBottom:  '-15px',
      marginRight: 'tokens.spacingS'
   }),
   removeIconCircle: css({
      border: '1px solid lightgrey',
      borderRadius: '5px',
      height: '10px',
      width: '25px'
   })
 };
 
function VariationItem(props) {
  return (
    <React.Fragment>
      <Subheading className={styles.subheading}>{props.variation.vwoVariation.name}</Subheading>
      <CreateContent 
         sdk={props.sdk}
         variation={props.variation}
         contentTypes={props.contentTypes}
         linkExistingEntry={props.linkExistingEntry}
         updateVwoVariationContent={props.updateVwoVariationContent}
         onCreateVariationEntry={props.onCreateVariationEntry}/>
    </React.Fragment>
  )
}

export default VariationItem;