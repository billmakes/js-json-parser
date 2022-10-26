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
          if (this.isDigit(literal) && this.peekBehind() != '"') {
            tok = this.newToken(TOKEN['INT'], parseFloat(literal));
          } else {
            if (
              (literal === 'false' || literal === 'true') &&
              this.peekBehind() != '"'
            ) {
              tok = this.newToken(TOKEN['BOOL'], literal);
            } else if (this.peekBehind() != '"' && literal === 'null') {
              tok = this.newToken(TOKEN['NULL'], literal);
            } else {
              tok = this.newToken(TOKEN['IDENT'], literal);
            }
          }
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
    return ch.match(/[a-zA-Z0-9()#*.?!_'\s]/i);
  }

  isDigit(ch) {
    return !isNaN(ch);
  }

  peekBehind() {
    return this.input[this.readPosition - 1];
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
