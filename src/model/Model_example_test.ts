
import { ExampleModel } from "./Model_example.ts";
import { Database } from "../database/Database.ts";

import { config,assertEquals,assertArrayIncludes,assertExists,makeid } from "../../test_deps.ts";

const env = config();

Deno.test(`Model_example invalid_01`, async () => {

    const model = new ExampleModel(env);
    const isValid = await model.handleLogin({
        'inputEmail' : "email",
        'inputPassword' : "password",
        'inputPasswordConfirm': "passwordConfirm"
    });

    assertEquals(isValid, false);
    assertExists(model.getErrors(), 'No errors.');
    assertExists(model.getErrors()['inputEmail'], "Input Email errors do not exist.");
    assertExists(model.getErrors()['inputPasswordConfirm'], "Input Password errors do not exist.");
    assertArrayIncludes(model.getErrors()['inputEmail'], ['Must be a valid email.']);
    assertArrayIncludes(model.getErrors()['inputPasswordConfirm'], ['Must match Password.']);

});


Deno.test(`Model_example valid_01`, async () => {

    const model = new ExampleModel(env);

    const email = `${makeid(8)}@email.com`;

    const response = await model.handleLogin({
        'inputEmail' : email,
        'inputPassword' : "password",
        'inputPasswordConfirm': "password"
    });

    assertEquals(response['affectedRows'], 1);

    const data = await model._database.query(`SELECT * FROM ${model.tableName()} WHERE id=?`, [response['lastInsertId']]);

    assertEquals(data[0]['email'], email);
    assertEquals(data[0]['password'], 'password');

    await model.closeDatabase();

});

