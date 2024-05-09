export function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let competed = 0;

    promises.forEach((promise, i) => {
      Promise.resolve(promise)
        .then((result) => {
          results[i] = result;
          competed += 1;

          if (competed === promises.length) {
            resolve(results);
          }
        })
        .catch((err) => reject(err));
    });
  });
}
