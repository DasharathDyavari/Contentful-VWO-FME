import { get } from "lodash";

export const getEntryStatus = sys => {
   if (sys.archivedVersion) {
     return 'archived';
   } else if (sys.publishedVersion) {
     if (sys.version > sys.publishedVersion + 1) {
       return 'changed';
     } else {
       return 'published';
     }
   } else {
     return 'draft';
   }
 };

export function getRequiredEntryInformation(entry, contentTypes, defaultLocale){
  console.log('here: ',entry,contentTypes);
   const contentTypeId = get(entry, ['sys', 'contentType', 'sys', 'id']);
   const contentType = contentTypes.find(contentType => contentType.sys.id === contentTypeId);

   if(!contentType){
      throw new Error(`Content type ${contentTypeId} is not present`);
   }

   const displayField = contentType.displayField;
   const descriptionFieldType = contentType.fields
   .filter(field => field.id != displayField)
   .find(field => field.type == 'Text');

   const description = descriptionFieldType
    ? get(entry, ['fields', descriptionFieldType.id, defaultLocale], '')
    : '';

    const title = get(entry, ['fields',displayField,defaultLocale],'Untitled');
    const status = getEntryStatus(entry.sys);

    return {
      title,
      description,
      contentType: contentType.name,
      status
    }
}

export const mapVwoVariationsAndContent = (vwoVariations,entries, contentTypes, defaultLocale) => {
  return vwoVariations.map(vwoVariation => {
    if(vwoVariation.jsonContent.value != 'notSet'){
      let contentId = vwoVariation.jsonContent.value;
      let entry = entries.find(entry => entry.sys.id == contentId);
      if(!entry){
        return {vwoVariation};
      }
      let entryInformation = getRequiredEntryInformation(entry, contentTypes, defaultLocale);
      return {
        vwoVariation,
        entry: entryInformation
      }
    }
    return {vwoVariation};
  })
}

export const variationsWithContent = (mappedVariations) => {
  return mappedVariations.filter(mappedVariation => mappedVariation.vwoVariation.jsonContent.value != 'notSet').length;
}