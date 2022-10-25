const Lexer = require('./lexer');
const TOKEN = require('./token');

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

class Parser {
  constructor(input) {
    this.l = new Lexer(input);

    this.root = null;

    this.curToken = null;
    this.peekToken = null;

    this.nextToken();
    this.nextToken();
    this.nextToken();

    this.errors = [];
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.nextToken();
  }

  parse() {
    let result;
    if (this.curTokenIs(TOKEN['LBRACE'])) {
      result = this.parseObj();
    } else if (this.curTokenIs(TOKEN['LBRACKET'])) {
      result = this.parseArr();
    } else if (this.curTokenIs(TOKEN['QUOTE'])) {
      result = this.parseString();
    } else if (this.curTokenIs(TOKEN['IDENT'])) {
      result = this.parseString();
    } else if (this.curTokenIs(TOKEN['INT'])) {
      result = this.parseNumber();
    } else {
      this.nextToken();
    }

    return result;
  }

  parseArr() {
    this.nextToken();
    const arr = [];
    while (!this.curTokenIs(TOKEN['RBRACKET'])) {
      let item = this.parse();
      if (item) {
        arr.push(item);
      }
    }
    return arr;
  }

  parseObj() {
    this.nextToken();
    let obj = {};
    while (!this.curTokenIs(TOKEN['RBRACE'])) {
      this.nextToken();
      if (this.curTokenIs(TOKEN['IDENT'])) {
        let key = this.curToken.literal;
        this.nextToken();
        if (this.curTokenIs(TOKEN['COLON'])) {
          // skip colon
          this.nextToken();
          // parse next token as value
          obj[key] = this.parse();
        }
      }
    }
    this.nextToken();
    return obj;
  }

  parseNumber() {
    return this.curToken.literal;
  }

  parseString() {
    this.nextToken();
    if (this.curTokenIs(TOKEN['IDENT'])) {
      let str = this.curToken.literal;
      this.nextToken();
      return str;
    }
  }

  curTokenIs(t) {
    return this.curToken?.type == t;
  }

  peekTokenIs(t) {
    return this.peekToken?.type == t;
  }

  expectPeek(t) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  peekError(t) {
    const msg = `Peek error, recieved: ${t}`;
    this.errors.push(msg);
  }
}

(function main() {
  const input =
    '{"data":{"hello":{"testArr":["item","item2"],"hi":"sup","test":{"ok":"cool","newObj":{"key":"this is a string"}}}}}';
  // const input =
  //   '[{"hello":{"hi":"sup","test":{ "ok":"cool" }}},{"newObj":"val"}]';
  //const input = '{"hello":{"hi":"sup"}}';

  let p = new Parser(input);
  let result = p.parse();

  console.log(input);
  console.log(JSON.stringify(result));
  console.log(JSON.stringify(result) === input);
})();
