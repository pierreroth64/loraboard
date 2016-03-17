export class BaseCodec {

  mayMatch(data) {
    throw new Error('You _must_ implement the mayMatch(..) method in your codec class');
  }
}
