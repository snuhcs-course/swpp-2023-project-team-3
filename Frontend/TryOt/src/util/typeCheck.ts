import * as t from 'io-ts';
import {isLeft} from 'fp-ts/lib/Either';
import {PathReporter} from 'io-ts/PathReporter';

export function typeCheck<T extends t.Any>(anyData: unknown, type: T) {
  const decodeResult = type.decode(anyData);
  if (isLeft(decodeResult)) {
    console.log('Invalid data:', anyData);
    throw new Error(
      `Could not validate data: ${PathReporter.report(decodeResult).join(
        '\n',
      )}`,
    );
  }
  return decodeResult.right as t.TypeOf<T>;
}
