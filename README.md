
# Run example (the original question)
```sh
node simulate.ts -p 6 -d 3 -t 3 -n 1000000 -s 5
```

(Node runs the `.ts` files directly. Relative imports therefore carry their `.ts` extension, and type-only imports use `import type` so nothing type-related is left at runtime.)

The probability of 5 Schock Outs is 0.00001804, or 18036 / 1000000000. (Takes a few seconds to run)

```sh
node index.ts
```

prints the exact probabilities instead of sampling them.
