import { assertEquals,assertArrayIncludes } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { Model, InputProperty } from "./Model.ts";

import { config } from "../../test_deps.ts";


const ENV = config();

Deno.test(`model_missing_property`, () => {

    class TestModel extends Model {
        public test1 = new InputProperty('test 1', 'test1');
        // public test2 = new InputProperty('test 2', 'test2');

        public rules() {
            return {
                'test1' : ['required'],
                    
                'test2' : [
                    'required',
                    {'min': 2}
                ]
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel(ENV);
    model.loadData({
        'test1':'wee wee',
        'test2':1
    })
    model.verify();
    assertArrayIncludes(model.getErrors()['test2'], ['Missing test2.']);

});


Deno.test(`model_empty_required_property`, () => {

    class TestModel extends Model {
        
        public test1 = new InputProperty('test 1', 'test1');
        public test2 = new InputProperty('test 2', 'test2');

        public rules() {
            return {
                'test1' : ['required'],
                    
                'test2' : ['required']
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel(ENV);
    model.loadData({
        'test1':'wee wee',
        'test2':''
    })
    model.verify();

    assertArrayIncludes(model.getErrors()['test2'], ['Required.']);

});


Deno.test(`model_valid_all_rules_used`, () => {

    class TestModel extends Model {
        
        public email = new InputProperty('Email', 'email');
        public age = new InputProperty('Age', 'age');
        public password = new InputProperty('Password', 'password');

        public rules() {
            return {
                'email' : [
                    'required',
                    'isEmail'
                ],
                'age' : [
                    'required',
                    {'minNum':13},
                    {'maxNum':120},
                ],
                'password' : [
                    'required',
                    {'min':6},
                    {'max':20}
                ]
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel(ENV);
    model.loadData({
        'email':'email@email.com',
        'password': 'password',
        'age':15
    });

    assertEquals(model.verify(), true);

});


Deno.test(`model_invalid_all_rules_used`, () => {

    class TestModel extends Model {
        
        public email = new InputProperty('Email', 'email');
        public age = new InputProperty('Age', 'age');
        public password = new InputProperty('Password', 'password');

        public rules() {
            return {
                'email' : [
                    'required',
                    'isEmail',
                ],
                'age' : [
                    'required',
                    {'minNum':13},
                    {'maxNum':120}
                ],
                'password' : [
                    'required',
                    {'min':6},
                    {'max':20}
                ]
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel(ENV);
    model.loadData({
        'email':'email//email.com',
        'password': 'pad',
        'age':1
    });

    assertEquals(model.verify(), false);
    assertArrayIncludes(model.getErrors()['email'], ['Must be a valid email.']);
    assertArrayIncludes(model.getErrors()['password'], ['Must be at least 6 characters.']);
    assertArrayIncludes(model.getErrors()['age'], ['Must be at least 13.']);

});

Deno.test(`model_valid_database`, async () => {

    class TestModel extends Model {
        
        public num = new InputProperty('Number', 'num');

        public rules() {
            return {
                'num' : [
                    'required'
                ]
            }
        }

        public tableName () {
            return 'test';
        }

    }

    const model = new TestModel(ENV);
    model.connectDatabase(ENV.DB_HOST, ENV.DB_USERNAME, ENV.DB_PASSWORD, ENV.DB_NAME);
    model.loadData({
        'num': 988
    });
    const res = await model.saveToDatabase();
    model.closeDatabase();

    assertEquals(model.verify(), true);
    assertEquals(res['affectedRows'], 1);

});