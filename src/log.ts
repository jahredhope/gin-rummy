const VERBOSE_LOG = false;

export const trace = (...params: any[]) => {
  if (VERBOSE_LOG) {
    console.log(...params);
  }
};
