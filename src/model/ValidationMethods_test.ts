
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import ValidationMethods from "./ValidationMethods.ts";

Deno.test(`match_valid_string_01`, () => {
    const res = ValidationMethods.match('string', 'string');
    assertEquals(res, true);
});

Deno.test(`match_valid_number_01`, () => {
    const res = ValidationMethods.match(78, 78);
    assertEquals(res, true);
});

Deno.test(`match_invalid_string_01`, () => {
    const res = ValidationMethods.match(`string`, `sing`);
    assertEquals(res, false);
});

Deno.test(`match_invalid_number_01`, () => {
    const res = ValidationMethods.match(78, 78);
    assertEquals(res, true);
});

Deno.test(`email_valid_01`, () => {
    const res = ValidationMethods.isEmail('email@email.com');
    assertEquals(res, true);
});

Deno.test(`email_invalid_01`, () => {
    const res = ValidationMethods.isEmail('email.com');
    assertEquals(res, false);
});

Deno.test(`email_valid_02`, () => {
    const res = ValidationMethods.isEmail('person.name@yahoo.org');
    assertEquals(res, true);
});

Deno.test(`email_invalid_02`, () => {
    const res = ValidationMethods.isEmail('person/name@yahooorg');
    assertEquals(res, false);
});

Deno.test(`max_valid_01`, () => {
    const res = ValidationMethods.max('four', 4);
    assertEquals(res, true);
});

Deno.test(`max_valid_02`, () => {
    const res = ValidationMethods.max(6, 10);
    assertEquals(res, true);
});

Deno.test(`max_invalid_01`, () => {
    const res = ValidationMethods.max('9999', 3);
    assertEquals(res, false);
});

Deno.test(`max_invalid_02`, () => {
    const res = ValidationMethods.max('string', 2);
    assertEquals(res, false);
});

Deno.test(`maxNum_valid_01`, () => {
    const res = ValidationMethods.maxNum(12, 20);
    assertEquals(res, true);
});

Deno.test(`maxNum_invalid_01`, () => {
    const res = ValidationMethods.maxNum(9999, 3);
    assertEquals(res, false);
});

Deno.test(`maxNum_invalid_02`, () => {
    const res = ValidationMethods.maxNum(5, 2);
    assertEquals(res, false);
});

Deno.test(`minNum_valid_01`, () => {
    const res = ValidationMethods.minNum(12, 12);
    assertEquals(res, true);
});

Deno.test(`minNum_invalid_01`, () => {
    const res = ValidationMethods.minNum(20, 111);
    assertEquals(res, false);
});

Deno.test(`minNum_invalid_02`, () => {
    const res = ValidationMethods.minNum(5, 6);
    assertEquals(res, false);
});