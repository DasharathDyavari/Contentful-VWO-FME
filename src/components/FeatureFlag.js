import { Card, Button,Heading, Box, Text, Paragraph, IconButton, Flex, Grid } from '@contentful/f36-components';
import React, {useEffect, useState} from 'react';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { PlusIcon, EditIcon } from '@contentful/f36-icons';
import CreateFeatureFlagModal from './CreateFeatureFlagModal';
import EditFeatureFlagModal from './EditFeatureFlagModal';

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
   }),
   editIcon: css({
      position: 'absolute',
      right: '0px',
      top: '0px'
   })
 };

function FeatureFlag(props) {

   const [createFlag, setCreateFlag] = useState(false);
   const [editMode, setEditMode] = useState(false);
   const [loading, setLoading] = useState(false);
   const [featureFlag, setFeatureFlag] = useState(props.featureFlag);

   const createNewFeatureFlag = async (featureFlag) => {
      if(!featureFlag){
         setCreateFlag(false);
         return;
      }
      setFeatureFlag(featureFlag);
      if(featureFlag.featureKey){
         await props.onFeatureFlagCreation(featureFlag);
      }
      setCreateFlag(false);
   }

   const editFeatureFlag = async (featureFlag) => {
      if(!featureFlag){
         setEditMode(false);
         return;
      }
      setLoading(true);
      let updatedFeatureFlag = {...props.featureFlag,
         name: featureFlag.flagName,
         featureType: featureFlag.featureType,
         description: featureFlag.description
       }
      return props.updateFeatureFlagDetails(updatedFeatureFlag)
      .then(resp => {
         props.sdk.notifier.success('Feature flag details updated successfully');
      })
      .catch(err => {
         props.sdk.notifier.error(err);
      })
      .finally(() => {
         setLoading(false);
         setEditMode(false);
      });
   }

   useEffect(() => {
      setFeatureFlag(props.featureFlag);
   },[props.featureFlag]);

   const isFeatureFlagCreated = featureFlag?.featureKey;
  return (
    <React.Fragment>
      <Heading element='h2'>Feature Flag:</Heading>
      <EditFeatureFlagModal isShown={editMode} onModalClose={editFeatureFlag} loading={loading} featureFlag={props.featureFlag}/>
      {!isFeatureFlagCreated && <Flex alignItems='center' flexDirection='column' justifyContent='center' className={styles.container}>
            <Flex alignItems='center' flexDirection='column' justifyContent='center' className={styles.tile}>
               <Paragraph element='h6'>Create VWO Feature flag in order to create Variations</Paragraph>
               <Button variant='primary' size='small' startIcon={<PlusIcon />} onClick={() => setCreateFlag(true)}>Create Feature Flag</Button>
            </Flex>
         </Flex>}
      {isFeatureFlagCreated && <Flex alignItems='center' flexDirection='column' justifyContent='center' marginLeft='spacingL' marginTop='spacingL'>
         <Card padding="large" radius="medium" style={{width: '600px'}}>
            <IconButton
               className={styles.editIcon}
               variant="transparent"
               onClick={() => editMode? setEditMode(false): setEditMode(true)}
               aria-label="Select the date"
               icon={<EditIcon />}
            />
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
               <Paragraph>{featureFlag.description || '-'}</Paragraph>
            </Box>
         </Card>
      </Flex>}
      <CreateFeatureFlagModal
         entryId={props.sdk.ids.entry}
         onModalClose={createNewFeatureFlag}
         isShown={createFlag}/>
    </React.Fragment>
  )
}

export default FeatureFlag;