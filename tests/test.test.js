import { describe, expect, test } from 'vitest';
import { promiseAll } from '../tasks/task1';
import { promiseAllSettled } from '../tasks/task2';
import { chainPromises } from '../tasks/task3';

function promiseConstructor(value, delay = 0, toReject = false, rejectReason = 'Promise rejected') {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (toReject) {
        reject(rejectReason);
      } else {
        resolve(value);
      }
    }, delay);
  });
}

const resolvedPromisesArray = [promiseConstructor(1), promiseConstructor(2, 1000), promiseConstructor(3)];

describe('Test all functions', () => {
  test('promise all should resolve values array', () => {
    expect(promiseAll(resolvedPromisesArray)).resolves.toEqual([1, 2, 3]);
  });
  test('promise all should reject first rejection', () => {
    expect(
      promiseAll([promiseConstructor(1), promiseConstructor(2, 1000), promiseConstructor(3, 0, true)]),
    ).rejects.toEqual('Promise rejected');
  });

  test('promiseAllSettled should resolve values array', () => {
    expect(
      promiseAllSettled([promiseConstructor(1), promiseConstructor(2, 1000), promiseConstructor(3, 0, true)]),
    ).resolves.toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'fulfilled', value: 2 },
      { status: 'rejected', reason: 'Promise rejected' },
    ]);
  });

  test('chainPromises returns promise with result of all functions resolve or reject', () => {
    function asyncFunction1() {
      return Promise.resolve('Result from asyncFunction1');
    }

    function asyncFunction1_2() {
      return Promise.reject('Result from asyncFunction1');
    }

    function asyncFunction2(data) {
      return Promise.resolve(data + ' - Result from asyncFunction2');
    }

    function asyncFunction3(data) {
      return Promise.resolve(data + ' - Result from asyncFunction3');
    }

    const functionsArray = [asyncFunction1, asyncFunction2, asyncFunction3];
    const functionsArray2 = [asyncFunction1_2, asyncFunction2, asyncFunction3];

    expect(chainPromises(functionsArray)).resolves.toEqual(
      'Result from asyncFunction1 - Result from asyncFunction2 - Result from asyncFunction3',
    );
    expect(chainPromises(functionsArray2)).rejects.toEqual('Result from asyncFunction1');
  });
});
