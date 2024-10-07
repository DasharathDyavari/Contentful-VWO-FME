import React from 'react';
import { css } from 'emotion';
import { CheckCircleIcon, InfoCircleIcon, ChevronRightIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { Text } from '@contentful/f36-components';

const styles = {
  note: css({
    marginBottom: tokens.spacingL
  }),
  container: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '30px',
    maxWidth: 1000
  }),
  item: css({
    display: 'flex',
    alignItems: 'center',
    fontSize: tokens.fontSizeM,
    color: tokens.colorTextMid
  }),
  itemSeparator: css({
    marginLeft: tokens.spacingM,
    marginRight: tokens.spacingM
  }),
  itemIcon: css({
    marginRight: tokens.spacingS
  })
};

function StatusItem(props) {
   if(props.active){
      return (
         <div className={styles.item}>
           <CheckCircleIcon
             className={styles.itemIcon}
             color={'positive'}
             size="small"
           />
           <Text>{props.children}</Text>
         </div>
       );
   }
   else{
      return (
        <div className={styles.item}>
          <InfoCircleIcon
            className={styles.itemIcon}
            color={'muted'}
            size="small"
          />
          <Text>{props.children}</Text>
        </div>
      );
   }
 }

function StatusSeparator() {
   return <ChevronRightIcon className={styles.itemSeparator} size="small" color="muted" />;
 }

function StatusBar(props) {
  return (
    <div className={styles.container}>
      <StatusItem active={props.currentStep > 1}>Create feature flag</StatusItem>
      <StatusSeparator />
      <StatusItem active={props.currentStep > 2}>Add variations and content</StatusItem>
      <StatusSeparator />
      <StatusItem active={props.currentStep > 3}>Publish variations</StatusItem>
    </div>
  )
}

export default StatusBar;