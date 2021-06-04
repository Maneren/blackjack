import Utils from 'my-utils';
const { React: { importAll } } = Utils;

const cards = importAll(require.context('./', false, /\.png*$/));
export default cards;
