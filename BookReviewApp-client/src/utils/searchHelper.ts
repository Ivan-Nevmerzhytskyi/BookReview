type SearchParam = string | number | boolean;
export type SearchParams = {
  [key: string]: SearchParam[] | SearchParam | null,
};

/**
 * This function prepares a correct search string
 * from a given currentParams and paramsToUpdate.
 */
export function getSearchWith(
  paramsToUpdate: SearchParams, // it's our custom type
  currentParams?: string | URLSearchParams,
): string {
  // copy currentParams by creating new URLSearchParams object
  const newParams = new URLSearchParams(currentParams);

  /**
   * - params with the `null` value are deleted;
   * - string or number value is set to given param key;
   * - array of strings or numbers adds several params with the same key;
   */
  Object.entries(paramsToUpdate)
    .forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        // we delete the key to remove old values
        newParams.delete(key);

        value.forEach(part => {
          newParams.append(key, part.toString());
        });
      } else {
        newParams.set(key, value.toString());
      }
    });

  // we return a string to use it inside links or hendlers
  return newParams.toString();
}
