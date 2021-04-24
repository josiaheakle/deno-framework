import { assertEquals,assertArrayIncludes } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import {Model, InputProperty} from "./Model.ts";


Deno.test(`missing property`, () => {

    class TestModel extends Model {
        public test1 = new InputProperty('test 1', 'test1');
        // public test2 = new InputProperty('test 2', 'test2');

        public rules() {
            return {
                'test1' : {
                    'required':true
                },
                'test2' : {
                    'required':true,
                    'min': 2
                }
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel();
    model.loadData({
        'test1':'wee wee',
        'test2':1
    })
    model.verify();
    assertArrayIncludes(model.errors['test2'], ['Missing test2.']);

});


Deno.test(`empty_required_property`, () => {

    class TestModel extends Model {
        
        public test1 = new InputProperty('test 1', 'test1');
        public test2 = new InputProperty('test 2', 'test2');

        public rules() {
            return {
                'test1' : {
                    'required':true
                },
                'test2' : {
                    'required':true,
                }
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel();
    model.loadData({
        'test1':'wee wee',
        'test2':''
    })
    model.verify();

    assertArrayIncludes(model.errors['test 2'], ['Required.']);

});


Deno.test(`valid_all_rules_used`, () => {

    class TestModel extends Model {
        
        public email = new InputProperty('Email', 'email');
        public age = new InputProperty('Age', 'age');
        public password = new InputProperty('Password', 'password');

        public rules() {
            return {
                'email' : {
                    'required':true,
                    'isEmail':true,
                },
                'age' : {
                    'required':true,
                    'min':13,
                    'max':120,
                },
                'password' : {
                    'required':true,
                    'min':6,
                    'max':20,
                }
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel();
    model.loadData({
        'email':'email@email.com',
        'password': 'password',
        'age':15
    });

    assertEquals(model.verify(), true);

});


Deno.test(`invalid_all_rules_used`, () => {

    class TestModel extends Model {
        
        public email = new InputProperty('Email', 'email');
        public age = new InputProperty('Age', 'age');
        public password = new InputProperty('Password', 'password');

        public rules() {
            return {
                'email' : {
                    'required':true,
                    'isEmail':true,
                },
                'age' : {
                    'required':true,
                    'minNum':13,
                    'maxNum':120,
                },
                'password' : {
                    'required':true,
                    'min':6,
                    'max':20,
                }
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel();
    model.loadData({
        'email':'email//email.com',
        'password': 'pad',
        'age':1
    });

    assertEquals(model.verify(), false);
    assertArrayIncludes(model.errors['Email'], ['Must be a valid email.']);
    assertArrayIncludes(model.errors['Password'], ['Must be at least 6 characters.']);
    assertArrayIncludes(model.errors['Age'], ['Must be at least 13.']);

});


Deno.test(`invalid_all_rules_used`, () => {

    class TestModel extends Model {
        
        public email = new InputProperty('Email', 'email');
        public age = new InputProperty('Age', 'age');
        public password = new InputProperty('Password', 'password');

        public rules() {
            return {
                'email' : {
                    'required':true,
                    'isEmail':true,
                },
                'age' : {
                    'required':true,
                    'minNum':13,
                    'maxNum':120,
                },
                'password' : {
                    'required':true,
                    'min':6,
                    'max':20,
                }
            }
        }

        public tableName () {
            return 'table';
        }

    }

    const model = new TestModel();
    model.loadData({
        'email':'',
        'password': '',
        'age':''
    });

    assertEquals(model.verify(), false);
    assertArrayIncludes(model.errors['Email'], ['Required.']);
    assertArrayIncludes(model.errors['Password'], ['Required.']);
    assertArrayIncludes(model.errors['Age'], ['Required.']);

});