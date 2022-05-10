import { statement } from "../statement";

import * as invoice from "./data/invoice.json";
import * as plays from "./data/plays.json";

import * as invoice_v1 from "./data/invoice_v1.json";
import * as plays_v1 from "./data/plays_v1.json";

test("example statement", () => {
  expect(statement(invoice, plays)).toMatchSnapshot();
});

test("statement with new play types", () => {
  expect(() => {
    statement(invoice_v1, plays_v1);
  }).toThrow(/unknown type/);
});
