function divideBigIntToString(a: bigint, b: bigint, decimalPlaces: bigint): string {
    if (b === 0n) {
      throw new Error("Division by zero");
    }

    const isNegativeResult = (a < 0n && b > 0n) || (a > 0n && b < 0n);
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;

    const quotient = a / b;
    const wholePart = quotient >= 0n ? quotient : -quotient;

    const wholePartString = wholePart.toString();

    if (decimalPlaces === 0n) {
      return isNegativeResult ? `-${wholePartString}` : wholePartString;
    }

    let remainder = a % b;
    let decimalPart = "";

    for (let i = 0n; i < decimalPlaces; i++) {
      remainder *= 10n;
      const digit = remainder / b;
      decimalPart += digit.toString();
      remainder %= b;
    }

    // Calculate a rounding factor
    const roundingFactor = (remainder * 10n * 10n) / b;

    // Adjust the last decimal digit based on the rounding factor
    const lastDecimalDigit = Number(decimalPart[decimalPlaces - 1]);
    if (roundingFactor >= 5n) {
      decimalPart = decimalPart.slice(0, decimalPlaces - 1) + (lastDecimalDigit + 1);
    } else {
      decimalPart = decimalPart.slice(0, decimalPlaces - 1) + lastDecimalDigit;
    }

    const result = `${wholePartString}.${decimalPart}`;
    return isNegativeResult ? `-${result}` : result;
  }

  // Example usage
  const a: bigint = 2n;
  const b: bigint = 3n;
  const decimalPlaces: bigint = 5n;

  const result: string = divideBigIntToString(a, b, decimalPlaces);
  console.log("Result:", result); // Output: "0.66667"
