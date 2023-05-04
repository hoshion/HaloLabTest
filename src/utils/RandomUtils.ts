export class RandomUtils {
  static getIn(from: number, till: number) {
    return Math.random() * (till - from) + from;
  }

  static getIntIn(from: number, till: number) {
    return (Math.random() * (till - from) + from) | 0;
  }
}