import React, {useState,useEffect, useCallback} from 'react';
import { Button, Heading, Paragraph, Select, Skeleton, Modal } from '@contentful/f36-components';
import useMethods from 'use-methods';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import VWOLogo from '../components/VWOLogo';
import StatusBar from '../components/StatusBar';
import SectionSplitter from '../components/SectionSplitter';
import FeatureFlag from '../components/FeatureFlag';
import tokens from '@contentful/f36-tokens';
import Variations from '../components/Variations';

const GlobalStateContext = React.createContext(null);

const styles = {
  editor: css({
    margin: tokens.spacingXl
  }),
  connect: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: 'transparent!important' // necessary to eliminate the forma styling in favor of the custom optimizely styling
    }
  })
};

const methods = state => {
  return {
    setInitialData({featureFlag, contentTypes, variations, entries }){
      state.featureFlag = featureFlag;
      state.variations = variations;
      state.contentTypes = contentTypes;
      state.entries = entries;
    },
    setLoading(loadingState){
      state.loading = loadingState;
    },
    setCurrentStep(step){
      state.currentStep = step;
    },
    setFeatureFlag(featureFlag){
      state.featureFlag = featureFlag;
    },
    setEntries(entries){
      state.entries = entries;
    },
    setVwoVariations(variations){
      state.vwoVariations = variations;
    },
    setError(message){
      state.error = message;
    },
    setVariations(variations){
      state.variations = variations;
    },
    setMeta(meta) {
      state.meta = meta;
    }
  }
}

const getInitialValues = sdk => ({
  loading: true,
  error: false,
  currentStep: 1,
  contentTypes: [],
  meta: sdk.entry.fields.meta?.getValue() || {},
  variations: sdk.entry.fields.variations.getValue() || [],
  vwoVariations: [],
  featureFlag: sdk.entry.fields.featureFlag.getValue() || {},
  entries: {}
})

const emptyState = (sdk) => {
  sdk.entry.fields.featureFlag.setValue({});
  sdk.entry.fields.variations.setValue([]);
}

const fetchInitialData = async (sdk) => {
  const { space, ids, locales } = sdk;
  const [contentTypes, entries] = await Promise.all([
    space.getContentTypes({ order: 'name', limit: 1000}),
    space.getEntries({ skip: 0, limit: 1000})
  ]);

  return {
    featureFlag: sdk.entry.fields.featureFlag.getValue(),
    contentTypes: contentTypes.items,
    variations: sdk.entry.fields.variations.getValue() || [],
    entries: entries.items
  }
}

const EntryEditor = (props) => {
  const globalState = useMethods(methods, getInitialValues(props.sdk));
  const [state, actions] = globalState;

  const addVwoVariation = useCallback(() => {
    let newVariation = {
      name: state.vwoVariations.length? `Variation-${state.vwoVariations.length}`: 'Control',
      id: state.vwoVariations.length+1,
      jsonContent: {
        variableId: 1,
        value: 'notSet'
      }
    };
    actions.setVwoVariations([...state.vwoVariations,newVariation]);
    actions.setLoading(false);
  });

  const addContentToVwoVariation = useCallback((variationId, contentId, updateEntries) => {
    let updatedVwoVariations = state.vwoVariations.map((_variation) => {
      if(_variation.id == variationId){
        _variation.jsonContent.value = contentId;
      }
      return _variation;
    });
    actions.setVwoVariations(updatedVwoVariations);
    if(updateEntries){
      props.sdk.space.getEntries({ skip: 0, limit: 1000}).then(resp => {
        actions.setEntries(resp.items);
      })
    }
  });

  const createFeatureFlag = useCallback((featureFlag) => {
    if(featureFlag.featureKey){
      props.sdk.entry.fields.featureFlag.setValue(featureFlag);
      actions.setFeatureFlag(featureFlag);
      actions.setCurrentStep(3);
    }
  });

  const linkExistingEntry = useCallback(async (vwoVariation) => {
    const data = await props.sdk.dialogs.selectSingleEntry({
      locale: props.sdk.locales.default
    });
    
    if(!data){
      return;
    }

    const variations = props.sdk.entry.fields.variations.getValue() || [];
    const meta = props.sdk.entry.fields.meta.getValue() || {};

    props.sdk.entry.fields.meta.setValue({
      ...meta,
      [vwoVariation.id]: data.sys.id
    });

    props.sdk.entry.fields.variations.setValue([
      ...variations,
      {
        sys: {
          type: 'Link',
          id: data.sys.id,
          linkType: 'Entry'
        }
      }
    ]);

    addContentToVwoVariation(vwoVariation.id, data.sys.id, false);
  });

  const createVariation = useCallback(async(variation, contentType) => {
    const data = await props.sdk.navigator.openNewEntry(contentType.sys.id,{
      slideIn: true
    });

    if(!data){
      return;
    }

    const variations = props.sdk.entry.fields.variations.getValue() || [];
    const meta = props.sdk.entry.fields.meta.getValue() || {};

    props.sdk.entry.fields.meta.setValue({
      ...meta,
      [variation.id]: data.entity.sys.id
    });

    props.sdk.entry.fields.variations.setValue([
      ...variations,
      {
        sys: {
          type: 'Link',
          id: data.entity.sys.id,
          linkType: 'Entry'
        }
      }
    ]);
    addContentToVwoVariation(variation.id, data.entity.sys.id, true);
  });

  const updateVwoVariationContent = useCallback((vwoVariationId, contentId) => {
    let vwoVariations = state.vwoVariations.map(_vwoVariation => {
      if(_vwoVariation.id == vwoVariationId){
        _vwoVariation.jsonContent.value = contentId;
      }
      return _vwoVariation;
    });
    actions.setVwoVariations(vwoVariations);
  });

  const removeVwoVariation = useCallback((variationId) => {
    let filteredVariations = state.vwoVariations.filter(variation => variation.id != variationId);
    actions.setVwoVariations(filteredVariations);
  });

  useEffect(() => {
    emptyState(props.sdk);
    if(!state.vwoVariations.length){
      addVwoVariation();
    }
    fetchInitialData(props.sdk)
      .then(data => {
        actions.setInitialData(data);
        return data;
      })
      .catch(() => {
        actions.setError('Unable to load initial data');
      });
  }, []);

  useEffect(() => {
    const unsubsribeVariationsChange = props.sdk.entry.fields.variations.onValueChanged(data => {
      actions.setVariations(data || []);
    });
    const unsubscribeMetaChange = props.sdk.entry.fields.meta.onValueChanged(data => {
      actions.setMeta(data || {});
    });

    return () => {
      unsubsribeVariationsChange();
      unsubscribeMetaChange();
    }
  },[
    actions,
    props.sdk.entry.fields.meta,
    props.sdk.entry.fields.variations
  ])

  const isFeatureFlagCreated = state.featureFlag.featureKey;

  return (
    <React.Fragment>
      <GlobalStateContext.Provider value={globalState}>
        <Modal title='Connect with VWO' isShown={props.client}>
          <Paragraph testId='reconnect-vwo'>
            Your VWO session has expired. Reconnect to continue editing.
          </Paragraph>
          <Button
            className={styles.connect}
            onClick={props.openAuth}
            testId='connect-button'
            isFullWidth
            buttonType='naked'>
          </Button>
          <VWOLogo />
        </Modal>

        <div className={styles.editor} testId='editor-page'>
          <StatusBar currentStep={state.currentStep}/>
          <SectionSplitter />
          {state.loading && <Skeleton.Container>
            <Skeleton.BodyText numberOfLines={10} />
          </Skeleton.Container>}
          {!state.loading && <FeatureFlag
            sdk={props.sdk}
            featureFlag={state.featureFlag}
            vwoVariation={state.vwoVariations[0]}
            contentTypes={state.contentTypes}
            linkExistingEntry={linkExistingEntry}
            onCreateVariation={createVariation}
            onFeatureFlagCreation={createFeatureFlag}
            updateVwoVariationContent={updateVwoVariationContent}
            entries = {state.entries}/>}
          {isFeatureFlagCreated && !state.loading && <SectionSplitter />}
          {isFeatureFlagCreated && !state.loading && 
            <Variations
              sdk={props.sdk}
              removeVwoVariation={removeVwoVariation}
              variations={state.variations}
              contentTypes={state.contentTypes}
              vwoVariations={state.vwoVariations}
              addVwoVariation={addVwoVariation}
              addContentToVwoVariation={addContentToVwoVariation}
              onCreateVariation={createVariation}
              linkExistingEntry={linkExistingEntry}
              updateVwoVariationContent={updateVwoVariationContent}
              entries = {state.entries}/>}
        </div>
      </GlobalStateContext.Provider>
    </React.Fragment>
  )
};

export default EntryEditor;
