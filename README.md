
# JE Model
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
2. Create new class extending Model. Implementing the following methods:
    - rules() : return {inputName : [rules, {ruleWithParam:param}]}
    - tableName() : return name of table model data is associated with

### Model Implementation
```ts
    import { Model, InputProperty } from "https://deno.land/x/je_model@v0.2.0/mod.ts";

    class ExampleModel extends Model {

        /* public InputProperty for each input field
         * InputProperty(displayName : string, columnName? : string)
         * only add columnName if property will be saved to database
         */
        public inputEmail           = new InputProperty('Email', 'email');
        public inputPassword        = new InputProperty('Password', 'password');
        public inputPasswordConfirm = new InputProperty('Repeat Password');

        // best to use _ before any property besides the InputProperties
        private _MAX_LEN = 20;
        private _MIN_LEN = 6;

        /**
         * Custom function to handle model implementation
         * not required
         */
        public async handleLogin(data : {[index:string]:any}) : Promise<any> {
            this.loadData(data);
            if(this.verify() === true) {
                try {
                    await this.connectDatabase(this._env.DB_HOST, this._env.DB_USERNAME, this._env.DB_PASSWORD, this._env.DB_NAME);
                    const res = await this.saveToDatabase();
                    return res;
                } catch (error) {
                    console.log(`========[Database Connection Error]=======\n`, error);
                    return false;
                }
            } else return false;
        }


        /**
         * Returns object with array of objects|strings for each input property
         * REQUIRED 
         */
        public rules() : {[index:string]:Array<string|{[index:string]:string|number}>} 
        {
            return {
                'inputEmail': [
                    'required', 'isEmail'
                ],
                'inputPassword': [
                    'required', {'max':this._MAX_LEN}, {'min':this._MIN_LEN}
                ],
                'inputPasswordConfirm': [
                    'required', {'max':this._MAX_LEN}, {'min':this._MIN_LEN}, {'match':'inputPassword'}
                ]
            }
        }

        /**
         * Returns string of table name for this datatype
         * REQUIRED
         */
        public tableName() : string 
        {
            return 'loginTable';
        }
    
    }

```
3. Create instance of class, load data and use verify to check rules. Be sure to pass env variables to constructor.
```ts
    const modelInstance = new ExampleModel(ENV);
    const result = await modelInstance.handleLogin({
        "inputEmail":"email@email.com",
        "inputPassword": "password",
        "inputPasswordConfirm":"password"
    }); // returns {affectedRows:1, lastInsertId:num} if success or false 
```

### Validation Methods

| Method Name | paramaters | Description|
| -----------|-------------|------------|
| required | none | Tests for emptiness. |
| isEmail  | none | Tests for valid email. |
| max     | max string length| Tests if string is less than or equal to max |
| maxNum   | max amount | Tests if number is less than or equal to max |
| min     | min string length| Tests if string is greater than or equal to min |
| minNum   | min amount | Tests if number is greater than or equal to min |
| match   | property name to match | Tests if value is equal to property with param name |

```ts
    public rules() : {[index:string]:any[]} {
        return {
            'inputFoo': [
                'required', 'isEmail', {'match': 'inputFooConfirm'}
            ],
            'inputFooConfirm': [
                'required'
            ]
        }
    }
```