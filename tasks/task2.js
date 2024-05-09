export function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let competed = 0;

    promises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then((value) => {
          results[i] = { status: 'fulfilled', value };
          competed += 1;
        })
        .catch((err) => {
          results[i] = { status: 'rejected', reason: err };
          competed += 1;
        })
        .finally(() => {
          if (competed === promises.length) {
            return resolve(results);
          }
        });
    });
  });
}
