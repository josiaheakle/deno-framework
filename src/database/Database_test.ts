import { Database } from "./Database.ts";
import { assertEquals, assertArrayIncludes } from "https://deno.land/std@0.95.0/testing/asserts.ts";

import { config } from "../../test_deps.ts";

const ENV = config();

Deno.test(`database_invalid_password_01`, async () => {
    const db = new Database('localhost', 'admin', 'admin', 'deno_app');
    await db.connect();
    let e = new Error();
    try {
        let res = await db.insert('table', {'data':'data'});
    } catch (error) {
        e = error;
        await db.close();
    }
    assertEquals(e.message, "Access denied for user 'admin'@'localhost' (using password: YES)");
});

Deno.test(`database_invalid_user_01`, async () => {
    const db = new Database('localhost', 'asdf', 'admin', 'deno_app');
    await db.connect();
    let e = new Error();
    try {
        let res = await db.insert('table', {'data':'data'});
    } catch (error) {
        e = error;
        await db.close();
    }
    assertEquals(e.message, "Access denied for user 'asdf'@'localhost' (using password: YES)");
});

Deno.test(`database_invalid_table_01`, async () => {
    const db = new Database('localhost', 'admin', 'password', 'deno_app');
    await db.connect();
    let e = new Error();
    try {
        let res = await db.insert('invalidTable', {'number':1});
    } catch (error) {
        e = error;
        await db.close();
    }
    assertEquals(e.message, "Table 'deno_app.invalidTable' doesn't exist");
});

Deno.test(`database_insert_valid_01`, async () => {
    const db = new Database(ENV.DB_HOST, ENV.DB_USERNAME, ENV.DB_PASSWORD, ENV.DB_NAME);
    await db.connect();
    let e = new Error();
    let res = await db.insert('test', {'num':1});
    await db.close();
    assertEquals(res['affectedRows'], 1);
});

Deno.test(`database_insert_valid_multiple_01`, async () => {
    const db = new Database(ENV.DB_HOST, ENV.DB_USERNAME, ENV.DB_PASSWORD, ENV.DB_NAME);
    await db.connect();
    let e = new Error();
    let res1 = await db.insert('test', {'num':1});
    let res2 = await db.insert('test', {'num':1});
    await db.close();
    assertEquals(res2['lastInsertId'], res1['lastInsertId'] + 1);
});