import snakeCase from "lodash/snakeCase";

export const formDataSerializer = <T extends Record<string, any>>(
  dataToBeSubmitted: T,
): FormData => {
  const formDataToSubmit = new FormData();
  for (const key in dataToBeSubmitted) {
    if (
      dataToBeSubmitted[key] !== null &&
      dataToBeSubmitted[key] !== undefined
    ) {
      formDataToSubmit.append(snakeCase(key), dataToBeSubmitted[key]);
    }
  }
  return formDataToSubmit;
};
