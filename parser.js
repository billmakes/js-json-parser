const Lexer = require('./lexer');
const TOKEN = require('./token');

class Parser {
  constructor(input) {
    this.l = new Lexer(input);

    this.root = null;

    this.curToken = null;
    this.peekToken = null;

    // read in the next two tokens
    this.nextToken();
    this.nextToken();
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
    } else if (this.curTokenIs(TOKEN['NULL'])) {
      result = this.parseNull();
    } else if (this.curTokenIs(TOKEN['BOOL'])) {
      result = this.parseBool();
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
          let value = this.parse();
          if (value?.type === 'bool') {
            // hack
            Object.assign(obj, { [key]: value.val });
            this.nextToken();
            return obj;
          } else if (value?.type === 'null') {
            // another hack
            Object.assign(obj, { [key]: value.val });
            this.nextToken();
            return obj;
          } else {
            obj[key] = value;
          }
        }
      }
    }
    this.nextToken();
    return obj;
  }

  parseNull() {
    return { type: 'null', val: null };
  }

  parseBool() {
    if (this.curToken.literal === 'true') {
      // hack
      return { type: 'bool', val: true };
    } else {
      return { type: 'bool', val: false };
    }
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
}

module.exports = Parser;
