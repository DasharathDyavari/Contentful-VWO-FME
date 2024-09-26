import React from 'react';
import { Button, EntryCard, Menu, MenuItem, Stack, Subheading, TextLink } from '@contentful/f36-components';
import { PlusIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

const styles = {
   container: css({
     marginTop: '-10px'
   }),
   item: css({
     marginBottom: '0px'
   }),
   menuList: css({
      maxHeight: '200px'
   }),
   menuListHeader: css({
      marginLeft: tokens.spacingS,
      fontWeight: 'bold'
   })
 };

function CreateContent(props) {
   const editContent = (vwoVariation) => {
      props.sdk.navigator.openEntry(vwoVariation.jsonContent.value,{slideIn: true});
    }

    const removeContent = (vwoVariation) => {
      const values = props.sdk.entry.fields.variations.getValue() || [];
      const meta = props.sdk.entry.fields.meta.getValue() || {};
  
      if(vwoVariation){
        delete meta[vwoVariation.id];
      }
      props.sdk.entry.fields.meta.setValue(meta);
      props.sdk.entry.fields.variations.setValue(values.filter(value => value.sys.id != vwoVariation.jsonContent.value));
      props.updateVwoVariationContent(vwoVariation.id, 'notSet');
    }

   const isContentAdded = props.variation.vwoVariation.jsonContent.value != 'notSet';
  return (
   <React.Fragment>
      {!isContentAdded && <Stack alignItems='start' flexDirection='column' spacing='spacingXs' className={styles.container}>
         <Menu>
            <Menu.Trigger>
               <TextLink
                  as="button"
                  variant="primary"
                  icon={<PlusIcon />}
                  alignIcon="start"
                  className={styles.item}
                  >Create entry and link</TextLink>
            </Menu.Trigger>
            <Menu.List className={styles.menuList}>
               <Menu.ListHeader className={styles.menuListHeader}>Select content type</Menu.ListHeader>
               {props.contentTypes.map(contentType => {
                  return <Menu.Item key={contentType.sys.id} onClick={() => props.onCreateEntry(props.variation.vwoVariation, contentType)}>{contentType.name}</Menu.Item>
               })}
            </Menu.List>
         </Menu>
         <TextLink
            as="button"
            variant="primary"
            icon={<PlusIcon />}
            alignIcon="start"
            onClick={() => props.linkExistingEntry(props.variation.vwoVariation)}
            className={styles.item}
            >Link an existing entry</TextLink>
      </Stack>}
      {isContentAdded && <EntryCard 
         status={props.variation.entry.status}
         contentType={props.variation.entry.contentType}
         title={props.variation.entry.title}
         description={props.variation.entry.description}
         onClick={() => props.editContent(props.variation.vwoVariation)}
         actions={[
            <MenuItem key='edit' onClick={() => editContent(props.variation.vwoVariation)}>Edit</MenuItem>,
            <MenuItem key='remove' isDisabled={!props.canRemoveContent} onClick={() => removeContent(props.variation.vwoVariation)}>Remove</MenuItem>,
         ]}/>}
   </React.Fragment>
  )
}

export default CreateContent;