import { Flex, Button, Grid, Text, Heading, Paragraph, Stack } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';
import { PlusIcon } from '@contentful/f36-icons';
import { mapVwoVariationsAndContent, variationsWithContent } from '../utils';
import React, { useCallback, useEffect } from 'react';
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
  const mappedVariations = mapVwoVariationsAndContent(props.vwoVariations, props.entries, props.contentTypes, props.sdk.locales.default);
  const canRemoveContent = variationsWithContent(mappedVariations) > 1;
  console.log('mappedVariations: ',mappedVariations,props.entries);

  return (
    <React.Fragment>
      <Heading element='h2' className={styles.heading}>Variations:</Heading>
      <Paragraph>Content created in this feature flag is available only for this feature flag</Paragraph>
      <Flex flexDirection='column' justifyContent='center' marginLeft='spacingM' marginTop='spacingL' marginBottom='spacingXl' gap='spacingXl' className={styles.container}>
        {mappedVariations.map((variation, index) => {
            return <VariationItem
              sdk={props.sdk}
              variation={variation}
              canRemoveContent={canRemoveContent}
              variationsCount={mappedVariations.length}
              removeVwoVariation={props.removeVwoVariation}
              linkExistingEntry={props.linkExistingEntry}
              contentTypes={props.contentTypes}
              onCreateVariation={props.createVariation}
              updateVwoVariationContent={props.updateVwoVariationContent}
              key={variation.vwoVariation.id}/>
        })}
      </Flex>
      <Button variant='primary' size='small' startIcon={<PlusIcon />} onClick={props.addVwoVariation}>Add Variation</Button>
    </React.Fragment>
  )
}

export default Variations;