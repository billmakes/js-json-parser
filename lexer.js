const TOKEN = require('./token');

class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0; // current position in input
    this.readPosition = 1; // next position in input
    this.ch = this.input[0]; // current character under examination
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = '';
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  newToken(type, ch) {
    return {
      type,
      literal: ch,
    };
  }

  nextToken() {
    let tok;

    this.eatWhitespace();

    switch (this.ch) {
      case '{':
        tok = this.newToken(TOKEN['LBRACE'], this.ch);
        break;
      case '}':
        tok = this.newToken(TOKEN['RBRACE'], this.ch);
        break;
      case '[':
        tok = this.newToken(TOKEN['LBRACKET'], this.ch);
        break;
      case ']':
        tok = this.newToken(TOKEN['RBRACKET'], this.ch);
        break;
      case ':':
        tok = this.newToken(TOKEN['COLON'], this.ch);
        break;
      case '"':
        tok = this.newToken(TOKEN['QUOTE'], this.ch);
        break;
      case ',':
        tok = this.newToken(TOKEN['COMMA'], this.ch);
        break;
      default:
        if (this.isLetter(this.ch)) {
          let literal = this.readIdentifier();
          if (this.isDigit(literal)) {
            tok = this.newToken(TOKEN['INT'], parseInt(literal, 10));
          } else {
            tok = this.newToken(TOKEN['IDENT'], literal);
          }
          break;
        } else {
          tok = this.newToken(TOKEN['ILLEGAL'], this.ch);
        }
    }

    this.readChar();

    return tok;
  }

  eatWhitespace() {
    while (
      this.ch == ' ' ||
      this.ch == '\t' ||
      this.ch == '\n' ||
      this.ch == '\r'
    ) {
      this.readChar();
    }
  }

  isLetter(ch) {
    return ch.match(/[a-zA-Z0-9()\s]/i);
  }

  isDigit(ch) {
    return !isNaN(ch);
  }

  peekChar() {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition];
    }
  }

  readIdentifier() {
    let position = this.position;
    while (this.isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }
}

module.exports = Lexer;
