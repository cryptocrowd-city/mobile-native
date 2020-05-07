import number from './number';
import BN from 'bn.js';

export default function currency(
  value: number,
  currencyName: string,
  affix: 'prefix' | 'suffix' | boolean = true,
): string {
  let output;

  switch (currencyName) {
    case 'usd':
    case 'money':
      output = number(value, 2, 2);

      if (affix === 'prefix') {
        return `$ ${output}`;
      } else if (affix === 'suffix') {
        return `${output} USD`;
      }

      return affix === true ? `$ ${output} USD` : `${output}`;

    case 'tokens':
      output = number(value, 0, 4);
      return affix === true || affix === 'suffix'
        ? `${output} tokens`
        : `${output}`;

    case 'rewards':
      output = number(value, 0, 4);
      return affix === true || affix === 'suffix'
        ? `${output} rewards`
        : `${output}`;

    default:
      return `${number(value)}`;
  }
}


// **
// Converts really long crypto values into friendly numbers
// Notes:
// Assumes input currency has 18 decimal places
// Decimals are *not* rounded up
// Trailing zeros are cut off (e.g. no decimals will be returned if decimal value is 0)
// **

export function toFriendlyCryptoVal(
  longCryptoVal: number | string,
  decimalCount?: number, // how many decimals you want to be returned
) {
  decimalCount = decimalCount || 3;
  decimalCount = decimalCount > 17 ? 17 : decimalCount;
  decimalCount = decimalCount < 0 ? 0 : decimalCount;

  const longVal = new BN(longCryptoVal.toString());
  const friendlyCryptoVal =
    longVal.div(new BN(10).pow(new BN(18 - decimalCount))).toNumber() /
    Math.pow(10, decimalCount);

  return friendlyCryptoVal;
}
