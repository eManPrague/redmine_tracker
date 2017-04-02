const called = [];

export const getCalled = () => called;

export const clearCalled = () => {
  called.clear();
};

export const electronAlert = (message) => {
  called.push(message);
};

export const electronInfo = (message) => {
  called.push(message);
};
