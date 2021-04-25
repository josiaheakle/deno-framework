import { Model, InputProperty } from "./Model.ts";
// import { Model, InputProperty } from "https://deno.land/x/je_model@v0.2.0/mod.ts";

class ExampleModel extends Model {

    // public InputProperty for each input field
    // InputProperty(displayName : string, columnName? : string) - 
    //      only add columnName if property will be saved to db 
    //      REQUIRED
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

export {ExampleModel};