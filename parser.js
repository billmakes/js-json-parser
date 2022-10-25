const Lexer = require('./lexer');
const TOKEN = require('./token');

const json_example = JSON.stringify({
  menu: {
    id: 'file',
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
    console.log('PARSING', this.curToken);
    if (this.curTokenIs(TOKEN['LBRACE'])) {
      this.nextToken();
      result = this.parseObj();
    }

    if (this.curTokenIs(TOKEN['LBRACKET'])) {
      this.nextToken();
      result = this.parseArr();
    }

    if (this.curTokenIs(TOKEN['QUOTE'])) {
      result = this.parseString();
      this.nextToken();
    }

    if (this.curTokenIs(TOKEN['VALUE'])) {
      result = this.parseString();
      this.nextToken();
    }

    if (this.curTokenIs(TOKEN['IDENT'])) {
      result = this.parseString();
      this.nextToken();
    }

    if (this.curTokenIs(TOKEN['COMMA'])) {
      this.nextToken();
    }

    return result;
  }

  parseArr(a = []) {
    console.log('we in an array rn lol', this.curToken);
    this.nextToken();
    const arr = a.length ? a : [];
    while (!this.curTokenIs(TOKEN['RBRACKET'])) {
      if (this.curTokenIs(TOKEN['IDENT'])) {
        arr.push(this.curToken.literal);
      }
      this.nextToken();
    }
    return arr;
  }

  parseObj() {
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
    return obj;
  }

  parseString() {
    if (this.curTokenIs(TOKEN['IDENT'])) {
      let str = this.curToken.literal;
      this.nextToken();
      return str;
    }
  }

  parseValue() {
    this.nextToken();
    const value = this.curToken.literal;
    return value;
  }

  curTokenIs(t) {
    //console.log(t);
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
})();
