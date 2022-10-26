const Parser = require('./parser');

const json_example = JSON.stringify({
  menu: {
    id: 1,
    value: 'File',
    popup: {
      menuitem: [
        { value: 'New', onclick: 'CreateNewDoc()' },
        { value: 'Open', onclick: 'OpenDoc()' },
        { value: 'Close', onclick: 'CloseDoc()' },
      ],
    },
  },
});

const json_example2 = JSON.stringify([
  {
    color: 'red',
    value: '#f00',
  },
  {
    color: 'green',
    value: '#0f0',
  },
  {
    color: 'blue',
    value: '#00f',
  },
  {
    color: 'cyan',
    value: '#0ff',
  },
  {
    color: 'magenta',
    value: '#f0f',
  },
  {
    color: 'yellow',
    value: '#ff0',
  },
  {
    color: 'black',
    value: '#000',
  },
]);

const json_example3 = JSON.stringify({
  id: '0001',
  type: 'donut',
  name: 'Cake',
  ppu: 0.55,
  batters: {
    batter: [
      { id: '1001', type: 'Regular' },
      { id: '1002', type: 'Chocolate' },
      { id: '1003', type: 'Blueberry' },
      { id: '1004', type: "Devil's Food" },
    ],
  },
  topping: [
    { id: '5001', type: 'None' },
    { id: '5002', type: 'Glazed' },
    { id: '5005', type: 'Sugar' },
    { id: '5007', type: 'Powdered Sugar' },
    { id: '5006', type: 'Chocolate with Sprinkles' },
    { id: '5003', type: 'Chocolate' },
    { id: '5004', type: 'Maple' },
  ],
});

const json_example4 = JSON.stringify({
  key: { test: null },
  one: { bool_test: true },
  two: { bool_test: false },
});

const json_tests = [json_example, json_example2, json_example3, json_example4];

(function tests() {
  json_tests.forEach((input) => {
    let p = new Parser(input);
    let result = p.parse();
    console.log(JSON.stringify(result) === input ? 'PASS' : 'FAIL');
  });
})();
