const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const waitFor = (cond: () => boolean, timeout = 5000, retryDelay = 200) => {
  return new Promise<void>(async (resolve, reject) => {
    setTimeout(() => {
      reject({message: "timeout"});
    }, timeout)

    while (true) {
      if (cond()) {
        resolve()
        return
      } else {
        await sleep(retryDelay);
      }
    }
  })
}
