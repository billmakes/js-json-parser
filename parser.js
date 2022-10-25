const Lexer = require('./lexer');

const TOKEN = {
  LBRACKET: '[',
  RBRACKET: '[',
  LBRACE: '{',
  RBRACE: '}',
  QUOTE: '"',
  COLON: ':',
  COMMA: ',',
  IDENT: 'IDENT',
  VALUE: 'VALUE',
  INT: 'INT',
  BOOL: 'BOOL',
  NULL: 'NULL',
  ILLEGAL: 'ILLEGAL',
};

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
    let arr = a;
    let item = this.parse();
    arr.push(item);
    this.nextToken();
    if (this.curTokenIs(TOKEN['COMMA'])) {
      this.nextToken();
      this.parseArr(arr);
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

  let p = new Parser(json_example);
  let result = p.parse();

  console.log(json_example);
  console.log(JSON.stringify(result));
})();
