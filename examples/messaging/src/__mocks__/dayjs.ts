const mock = () => ({
  fromNow: jest.fn().mockReturnValue('Test date')
});

mock.extend = jest.fn();

export default mock;
