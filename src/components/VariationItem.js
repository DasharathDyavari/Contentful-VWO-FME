import React, {useEffect, useState} from 'react';
import { css } from 'emotion';
import { Paragraph, Flex, Stack, ButtonGroup, TextInput, TextLink, Text, IconButton, Button } from '@contentful/f36-components';
import CreateContent from './CreateContent';
import tokens from '@contentful/f36-tokens';
import { EditIcon, DoneIcon } from '@contentful/f36-icons';

const styles = {
   variationContainer: css({
    marginBottom: '20px'
   }),
   variationTile: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid lightgrey',
    borderRadius: '10px',
    padding: '25px'
 })
 };
 
function VariationItem(props) {

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && e.target.value.length) {
      await handleSaveClick();
    }
  };

  const handleDiscard = () => {
    setName(props.variation.vwoVariation.name);
    setIsEditing(false);
  }

  const handleSaveClick = async () => {
    if(name.length){
      setLoading(true);
      await props.updateVwoVariationName(props.variation.vwoVariation, name);
      setLoading(false);
      setIsEditing(false);
    } else {
      props.sdk.notifier.error('Variation name is required');
    }
  };

  useEffect(() => {
    setName(props.variation.vwoVariation.name);
  },[props.variation]);

  return (
    <React.Fragment>
      <div className={styles.variationContainer}>
        <Flex alignItems="center" marginBottom='spacingXs'>
          {!isEditing ? (
            <Stack flexDirection="row" alignItems="center" spacing="spacingXs">
              <Text>{`${props.index}_${name}`}</Text>
              <IconButton
                icon={<EditIcon />}
                aria-label="Edit"
                size="tiny"
                variant="secondary"
                onClick={() => setIsEditing(true)}
              />
            </Stack>
          ) : (
            <Flex alignItems="center" spacing="spacingXs">
              <TextInput
                style={{marginRight: '20px'}}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                size='small'
                autoFocus
              />
              <ButtonGroup variant='spaced' spacing='spacingS'>
                <TextLink
                  isLoading={loading}
                  as="button"
                  style={{fontSize: '1rem'}}
                  variant="primary"
                  onClick={handleSaveClick}>Save</TextLink>
                <TextLink
                  isLoading={loading}
                  style={{fontSize: '1rem'}}
                  as="button"
                  variant="secondary"
                  onClick={handleDiscard}>Discard</TextLink>
              </ButtonGroup>
            </Flex>
          )}
        </Flex>
        <div className={props.variation.variationContent? '': styles.variationTile}>
          <CreateContent 
            sdk={props.sdk}
            variation={props.variation}
            contentTypes={props.contentTypes}
            linkExistingEntry={props.linkExistingEntry}
            updateVwoVariationContent={props.updateVwoVariationContent}
            onCreateVariationEntry={props.onCreateVariationEntry}/>
        </div>
      </div>
    </React.Fragment>
  )
}

export default VariationItem;