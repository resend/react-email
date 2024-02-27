import { getElementAttributesFromSupportEntry } from "./get-element-attributes-from-support-entry";

test('getElementAttributesFromSupportEntry()', () => {
  expect(getElementAttributesFromSupportEntry('dir attribute')).toEqual(['dir']);
});
