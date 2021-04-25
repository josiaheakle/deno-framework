
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
    import { Model, InputProperty } from "https://deno.land/x/je_model@v0.2.0/mod.ts";

    class ExampleModel extends Model {

        // public InputProperty for each input field
        // InputProperty(displayName : string, columnName? : string)
        //      only add columnName if property will be saved to database
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
3. Create instance of class, load data and use verify to check rules. 
```ts
    const modelInstance = new ExampleModel(ENV);
    const result = await modelInstance.handleLogin({
        "inputEmail":"email@email.com",
        "inputPassword": "password",
        "inputPasswordConfirm":"password"
    }); // returns {affectedRows:1, lastInsertId:num} if success or false 
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