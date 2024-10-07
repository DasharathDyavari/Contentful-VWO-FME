import React, {useState, useEffect} from 'react';
import { Button } from '@contentful/f36-components';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

const styles = {
  button: css({
    marginBottom: tokens.spacingS
  })
};

const Sidebar = (props) => {
  const [featureFlag, setFeatureFlag] = useState(props.sdk.entry.fields.featureFlag.getValue());
  
  useEffect(() => {
    const unsubscribeFeatureFlagChange = props.sdk.entry.fields.featureFlag.onValueChanged(data => {
      setFeatureFlag(data || {});
    });

    return () => unsubscribeFeatureFlagChange();
  },[props.sdk.entry.fields.featureFlag]);

  return <React.Fragment>
      <Button
        isFullWidth
        className={styles.button}
        isDisabled={!featureFlag?.id}
        href={`https://vwotestapp7.vwo.com/#/full-stack/feature-flag/${featureFlag?.id}/edit/variables`}
        as={featureFlag?.id? 'a': 'button'}
        target="_blank">
        View in VWO
      </Button>
      <Button
        isFullWidth
        as='a'
        className={styles.button}
        target="_blank"
        href={'https://vwotestapp7.vwo.com/#/full-stack/feature-flag'}>
        View all Feature flags
      </Button>
  </React.Fragment>;
};

export default Sidebar;
