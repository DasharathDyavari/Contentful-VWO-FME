import React, { useState } from 'react';
import PropTypes from 'prop-types';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';
import { EditIcon, HelpCircleIcon } from '@contentful/f36-icons';

import {
  Heading,
  Paragraph,
  Menu,
  Table,
  TableRow,
  TableCell,
  TextLink,
  IconButton,
  Tooltip,
  Text,
  Flex,
  SectionHeading
} from '@contentful/f36-components';
import RefToolTip from './RefToolTip';

const styles = {
  table: css({
    marginTop: tokens.spacingS
  }),
  link: css({
    marginRight: tokens.spacingS
  }),
  contentTypeRow: css({
    gridTemplateColumns: 'auto 6rem'
  }),
  refList: css({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }),
  sectionHeading: css({
    marginTop: tokens.spacingL,
    marginBottom: tokens.spacingM
  })
};

ContentTypes.propTypes = {
  addedContentTypes: PropTypes.array.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default function ContentTypes({
  addedContentTypes,
  allContentTypes,
  allReferenceFields,
  onEdit
}) {
   console.log("here: ",allReferenceFields)
  return (
    <>
      <Flex flexDirection='column' marginBottom='spacingS'>
         <Heading marginBottom='spacingXs'>Content types for A/B testing</Heading>
         <Paragraph>Select the content types with reference fields for A/B testing.</Paragraph>
        {/* <Button
          buttonType="muted"
          onClick={() => toggleModal(true)}
          disabled={!addableContentTypes.length}
          testId="add-content">
          Add content type
        </Button> */}
        {addedContentTypes.length > 0 ? (
          <Table className={styles.table}>
            <Table.Head>
               <Table.Row>
                  <Table.Cell>Content name</Table.Cell>
                  <Table.Cell>Field name</Table.Cell>
                  <Table.Cell>Action</Table.Cell>
               </Table.Row>
            </Table.Head>
            <Table.Body>
              {addedContentTypes.map(id => (
                <ContentTypeRow
                  key={id}
                  contentTypeId={id}
                  allContentTypes={allContentTypes}
                  allReferenceFields={allReferenceFields}
                  onEdit={onEdit}
                />
              ))}
            </Table.Body>
          </Table>
        ) : null}
      </Flex>
    </>
  );
}

ContentTypeRow.propTypes = {
  contentTypeId: PropTypes.string.isRequired,
  allContentTypes: PropTypes.array.isRequired,
  allReferenceFields: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};

function ContentTypeRow({
  contentTypeId,
  allContentTypes,
  allReferenceFields,
  onEdit
}) {
  const contentType = allContentTypes.find(ct => ct.sys.id === contentTypeId);
  const referenceFields = allReferenceFields[contentTypeId];
  const referenceFieldIds = Object.keys(referenceFields);
  const referencesToShow = referenceFieldIds.filter(id => referenceFields[id]);

  if (!referencesToShow.length) {
    return null;
  }

  // if any references are disabled, we should not allow for the delete button
  let anyDisabled = false;

  return (
    <TableRow>
      <TableCell className={styles.contentTypeRow}>
        <strong>{contentType.name}</strong>
      </TableCell>
      <TableCell className={styles.contentTypeRow}>
        {referencesToShow.map(id => {
          const field = contentType.fields.find(f => f.id === id) || {};
          const disabled = false;

          if (disabled) {
            anyDisabled = true;
          }

          return (
            <Flex alignItems='center' key={id}>
               <Text marginRight='spacingXs'>{field.name}</Text>
               <Tooltip
                  className={styles.tooltip}
                  content="This field can have a variation container assigned to it by default because it has no explicit validations"
                  place="right">
                  <HelpCircleIcon variant='muted'/>
               </Tooltip>
            </Flex>
          );
        })}
      </TableCell>
      <TableCell className={styles.contentTypeRow}>
         <Menu>
            <Menu.Trigger>
               <IconButton
                  variant="secondary"
                  icon={<EditIcon />}
                  aria-label="toggle menu"
               />
            </Menu.Trigger>
            <Menu.List>
               <Menu.Item>
                  <TextLink onClick={() => onEdit(contentTypeId)} className={styles.link}>
                     Edit
                  </TextLink></Menu.Item>
               <Menu.Item>
                  <TextLink
                     className={styles.link}
                     linkType="negative">
                     Delete
                  </TextLink>
               </Menu.Item>
            </Menu.List>
         </Menu>
      </TableCell>
    </TableRow>
  );
}
