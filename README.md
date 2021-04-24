
# Model 
Author : [Josiah Eakle](https://josiaheakle.com)

An abstract model class with mySQL connection to handle input rules and validation.

## Usage
1. Set up mySQL environment variables in .env file. 
```
    DB_HOST=
    DB_USERNAME=
    DB_PASSWORD=
    DB_NAME=
```
### Model Implementation
2. Create class extending from model with rules(), tableName(), and valid InputProperties. InputProperty must have the same name as the rule, first param is the display name, second param is optional and is the column name (only use if the property will be saved to the database). 
```ts
    import {Model, InputProperty} from "";

    class FooModel extends Model {
        
        public inputFoo         = new InputProperty("Foo", "foo");
        public inputFooConfirm  = new InputProperty("Foo Confirm");
        public inputBar         = new InputProperty("Bar", "bar");
        public inputEmail       = new InputProperty("Email", "email");

        public tableName() : string {
            return "table";
        }

        public rules() : {[index:string]:{[index:string]:any}} {
            return {
                "inputFoo":{
                    "required":true,
                    "max":5
                }, 
                "inputBar":{
                    "required":true,
                    "min": 4
                },
                "inputEmail": {
                    "required":true,
                    "isEmail":true
                }
            }
        }
    }
```
3. Create instance of class, load data and use verify to check rules. 
```ts
    const fooModel = new FooModel();
    fooModel.loadData({
        "inputFoo":"input text", // Will be invalid as it is more than 5 characters
        "inputBar": "input text",
        "inputEmail":"email@email.com"
    });
    fooModel.verify() // false as inputFoo does follow the rule
```
4. If valid, connect to database and save data. Escapes values of any illegal sql characters.
```ts
    if(fooModel.verify()) {
        await fooModel.connectDatabase(ENV.DB_HOST, ENV.DB_USERNAME, ENV.DB_PASSWORD, ENV.DB_NAME);
        await fooModel.saveToDatabase();
        await fooModel.closeDatabase();
    }
```
### Validation Methods
 - required (no param)
 - isEmail  (no param)
 - max      (max string length)
 - maxNum   (max amount)
 - min      (min string length)
 - minNum   (min amoun)
 - match    (property name to match)

```ts
    public rules() : {[index:string]:{[index:string]:any}} {
        'inputFoo': {
            'required':null,
            'isEmail': null,
            'max': 20,
            'min': 4,
            'match': 'inputFooConfirm'    
        }
    }
```