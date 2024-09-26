import { Card, Button,Heading, Box, Text, Paragraph, Flex, Grid } from '@contentful/f36-components';
import React, {useState} from 'react';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { PlusIcon } from '@contentful/f36-icons';
import CreateFeatureFlagModal from './CreateFeatureFlagModal';

const styles = {
   flexContainer: css({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: tokens.spacingL
   }),
   container: css({
      width: '100%',
      height: '300px'
   }),
   tile: css({
      width: '600px',
      height: '150px',
      border: '1px solid lightgrey',
      borderRadius: '10px'
   })
 };

function FeatureFlag(props) {

   const [createFlag, setCreateFlag] = useState(false);
   const [featureFlag, setFeatureFlag] = useState(props.featureFlag);
   const [editMode, setEditMode] = useState(false);

   const createNewFeatureFlag = (featureFlag) => {
      if(!featureFlag){
         setCreateFlag(false);
         return;
      }
      setFeatureFlag(featureFlag);
      if(featureFlag.featureKey){
         props.onFeatureFlagCreation(featureFlag);
      }
      setCreateFlag(false);
   }
   console.log('sdk: ',props.sdk);
   const isFeatureFlagCreated = props.featureFlag?.featureKey;

  return (
    <React.Fragment>
      <Heading element='h2'>Feature Flag:</Heading>
      {!isFeatureFlagCreated && <Flex alignItems='center' flexDirection='column' justifyContent='center' className={styles.container}>
            <Flex alignItems='center' flexDirection='column' justifyContent='center' className={styles.tile}>
               <Paragraph element='h6'>Create VWO Feature flag in order to create Variations</Paragraph>
               <Button variant='primary' size='small' startIcon={<PlusIcon />} onClick={() => setCreateFlag(true)}>Create Feature Flag</Button>
            </Flex>
         </Flex>}
      {isFeatureFlagCreated && <Flex alignItems='center' flexDirection='column' justifyContent='center' marginLeft='spacingL' marginTop='spacingL'>
         <Card padding="spacingL" radius="medium" style={{width: '600px'}}>
            <Grid rowGap="spacingM" columns='1fr 1fr' columnGap='spacingM'>
               <Grid.Item>
                  <Text as="h4" fontWeight="fontWeightBold">Feature Name:</Text>
                  <Paragraph>{featureFlag.name}</Paragraph>
               </Grid.Item>

               <Grid.Item>
                  <Text as="h4" fontWeight="fontWeightBold">Feature Key:</Text>
                  <Paragraph>{featureFlag.featureKey}</Paragraph>
               </Grid.Item>

               <Grid.Item>
                  <Text as="h4" fontWeight="fontWeightBold">Feature Type:</Text>
                  <Paragraph>{featureFlag.featureType}</Paragraph>
               </Grid.Item>

               <Grid.Item>
                  <Text as="h4" fontWeight="fontWeightBold">Contentful ID:</Text>
                  <Paragraph>{featureFlag.id}</Paragraph>
               </Grid.Item>

            </Grid>
            <Box width="100%" marginTop='200px'>
               <Text as="h4" fontWeight="fontWeightBold">Description:</Text>
               <Paragraph>{featureFlag.description}</Paragraph>
            </Box>
         </Card>
      </Flex>}
      <CreateFeatureFlagModal
         sdk={props.sdk}
         setCreateFlag={setCreateFlag}
         vwoVariation={props.vwoVariation}
         contentTypes={props.contentTypes}
         onCreateEntry={props.onCreateVariation}
         updateVwoVariationContent={props.updateVwoVariationContent}
         onModalClose={createNewFeatureFlag}
         linkExistingEntry={props.linkExistingEntry}
         entries={props.entries}
         onCreateVariation={props.onCreateVariation}
         isShown={createFlag}/>
    </React.Fragment>
  )
}

export default FeatureFlag;