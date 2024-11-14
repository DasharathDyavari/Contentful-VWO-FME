import React from 'react';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { Modal, Flex, Paragraph, Text } from '@contentful/f36-components';

const styles = {
   item: css({
     marginBottom: tokens.spacingM
   }),
   title: css({
      marginBottom: tokens.spacing2Xs
   }),
   descriptionStyle: css({
     display: '-webkit-box',
     WebkitBoxOrient: 'vertical',
     WebkitLineClamp: 2, // Limit to 2 lines
     overflow: 'hidden',
     textOverflow: 'ellipsis',
     whiteSpace: 'normal', // Allows text wrapping within lines
   })
 };

function FeatureFlagDetailsModal(props) {
  return (
    <div>
      <Modal isShown={true} onClose={() => props.onClose()} size="medium" className={styles.modal}>
        <Modal.Header title="Feature flag details" onClose={() => props.onClose()} style={{padding: '10px 0px'}}/>
        
        <Modal.Content style={{padding: '10px 0px'}}>
          <Flex flexDirection='column'>
            {/* Name Section */}
            <Flex flexDirection='column' className={styles.item}>
              <Text className={styles.title}>Name</Text>
              <Text fontWeight='fontWeightDemiBold'>{props.featureFlag.name}</Text>
            </Flex>
  
            {/* Key Section */}
            <Flex flexDirection='column' className={styles.item}>
              <Text fontWeight="bold" className={styles.title}>Key</Text>
              <Text fontWeight='fontWeightDemiBold'>{props.featureFlag.featureKey}</Text>
            </Flex>
  
            {/* Feature Type Section */}
            <Flex flexDirection='column' className={styles.item}>
              <Text fontWeight="bold" className={styles.title}>Feature type</Text>
              <Text fontWeight='fontWeightDemiBold'>{props.featureFlag.type}</Text>
            </Flex>
  
            {/* Contentful ID Section */}
            <Flex flexDirection='column' className={styles.item}>
              <Text fontWeight="bold" className={styles.title}>Contentful ID</Text>
              <Text fontWeight='fontWeightDemiBold'>{props.featureFlag.id}</Text>
            </Flex>
  
            {/* Description Section */}
            <Flex flexDirection='column' className={styles.item}>
              <Text fontWeight="bold" className={styles.title}>Description</Text>
              <Paragraph fontWeight='fontWeightDemiBold' className={styles.descriptionStyle}>
               {props.featureFlag.description || '-'}
              </Paragraph>
            </Flex>
          </Flex>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default FeatureFlagDetailsModal;