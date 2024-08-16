import _ from 'lodash';

export const transformToArray = (value: string | string[]): string[] => {
  if (_.isArray(value)) {
    return value;
  } else {
    return [value];
  }
};
