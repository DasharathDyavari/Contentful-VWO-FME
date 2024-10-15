import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, IconButton, Text, Flex, TextInput, Subheading } from '@contentful/f36-components';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { EditIcon, DoneIcon } from '@contentful/f36-icons';


const styles = {
  button: css({
    marginBottom: tokens.spacingS
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

const Sidebar = (props) => {
  const [featureFlag, setFeatureFlag] = useState(props.sdk.entry.fields.featureFlag.getValue() || {});
  const [nameEditing, setNameEditing] = useState(false);
  const [descriptionEditing, setDescriptionEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFeatureFlagValue = () => {
    const featureFlag = props.sdk.entry.fields.featureFlag.getValue();
    if(featureFlag){
      setFeatureFlag(featureFlag);
      setName(featureFlag.name || '');
      setDescription(featureFlag.description || '');
    }
  }

  const updateFeatureFlagDetails = async (updatedFeatureFlag) => {
    return new Promise(async (resolve, reject) => {
      const response = await props.client.updateFeatureFlag(updatedFeatureFlag);
      if(response && response._data){
        props.sdk.entry.fields.featureFlag.setValue(response._data);
        resolve(response._data);
      }
      else if(response && response._errors?.length){
        reject(response._errors[0].message);
      }
      else{
        reject('Something went wrong while updating Feature flag details. Please try again');
      }
    });
  }

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && e.target.value.length) {
      await handleSaveClick();
    }
  };

  const handleDiscard = () => {
    resetFeatureFlagValue();
    setNameEditing(false);
    setDescriptionEditing(false);
  }

  const handleSaveClick = async () => {
    if(nameEditing && !name){
      props.sdk.notifier.error('Feature flag name is required');
      return;
    }
    let featureFlag = props.sdk.entry.fields.featureFlag.getValue();
    featureFlag.name = name;
    featureFlag.description = description;
    setLoading(true);

    updateFeatureFlagDetails(featureFlag)
    .then((featureFlag) => {
      setFeatureFlag(featureFlag);
      props.sdk.notifier.success('VWO Feature flag updated successfully');
    })
    .catch((err) => {
      props.sdk.notifier.success(err);
    })
    .finally(() => {
      setLoading(false);
      setNameEditing(false);
      setDescriptionEditing(false);
    });
  };

  const openModal = () => {
    window.sdk.window.postMessage('open-modal');
  };
  
  useEffect(() => {
    resetFeatureFlagValue();
  },[props.sdk.entry.fields.featureFlag]);

  const isFeatureFlagAdded = !!featureFlag?.id;

  return <React.Fragment>
      {/* Feature flag details */}
      <Flex flexDirection='column' marginBottom='spacingM'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text>Name:</Text>
            {nameEditing? (
              <ButtonGroup variant='spaced'>
                <Button variant="positive" size="small" onClick={handleSaveClick} isLoading={loading}>
                  Save
                </Button>
                <Button variant="negative" size="small" onClick={handleDiscard}>
                  Discard
                </Button>
              </ButtonGroup>
            ): (
              <IconButton
                icon={<EditIcon />}
                isDisabled={!isFeatureFlagAdded}
                aria-label="Edit"
                size="tiny"
                variant="secondary"
                onClick={() => setNameEditing(true)}/>
            )}
          </Flex>
          {nameEditing && isFeatureFlagAdded? (<Flex alignItems="center" spacing="spacingXs">
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              size='small'
              autoFocus
            />
          </Flex>
        ): (
          <Text fontWeight='fontWeightDemiBold' fontSize="fontSizeM" marginTop='spacing2Xs'>{name || '-'}</Text>
        )}
      </Flex>

      <Flex flexDirection='column' marginBottom='spacingXs'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text>Description:</Text>
            {descriptionEditing? (
              <ButtonGroup variant='spaced'>
                <Button variant="positive" size="small" onClick={handleSaveClick} isLoading={loading}>
                  Save
                </Button>
                <Button variant="negative" size="small" onClick={handleDiscard}>
                  Discard
                </Button>
              </ButtonGroup>
            ): (
              <IconButton
                icon={<EditIcon />}
                aria-label="Edit"
                isDisabled={!isFeatureFlagAdded}
                size="tiny"
                variant="secondary"
                onClick={() => setDescriptionEditing(true)}/>
            )}
          </Flex>
          {descriptionEditing && isFeatureFlagAdded? (<Flex alignItems="center" spacing="spacingXs">
            <TextInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              size='small'
              autoFocus
            />
          </Flex>
        ): (
          <Text fontWeight='fontWeightDemiBold' fontSize="fontSizeM" className={styles.descriptionStyle} marginTop='spacing2Xs'>{description || '-'}</Text>
        )}
      </Flex>
      {featureFlag?.id && <Button variant="transparent" onClick={props.showFeatureFlagDetails} style={{color: '#0059C8', marginTop: '0px'}}>Show all details</Button>}
      <ButtonGroup variant='spaced' spacing='spacingM'>
        <Button
          as='a'
          className={styles.button}
          target="_blank"
          href={'https://app.vwo.com/#/full-stack/feature-flag'}>
          View all Feature flags
        </Button>
        <Button
          className={styles.button}
          isDisabled={!isFeatureFlagAdded}
          href={`https://app.vwo.com/#/full-stack/feature-flag/${featureFlag?.id}/edit/variables`}
          as={featureFlag?.id? 'a': 'button'}
          target="_blank">
          View in VWO
        </Button>
      </ButtonGroup>
  </React.Fragment>;
};

export default Sidebar;
