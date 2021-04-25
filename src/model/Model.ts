import ValidationMethods from "./ValidationMethods.ts";
import InputProperty from "./InputProperty.ts";
import {Database} from "../database/Database.ts";
import {escapeSql} from "../../deps.ts";

abstract class Model  {
    [index: string]: any

    /*
     * Set input fields to public properties as InputProperty objects with 
     * same names as object keys in loadData.
     * this.load will load data into properties, 
     * this.verify will check rules set in this.rules
     * to verify input matches specified rules, adds errors to this.errors instance.
     * use this.connectDatabase to create database connect, .closeDatabase to close, and .saveToDatabase 
     * to save data, just be sure to verify first! 
     */


    private _errors     : {[index: string]:Array<string>} = {};
    public _database    : Database = new Database(); // public for testing purposes
    public _env        : {[index:string]:string};

    constructor(config : {[index:string]:string}) {
        this._env = config;
    }

    /**
     * Returns object with input properties as first key, 
     * with rule methods and param as own object key value pair of first value
     * ---
     * @return {object} (ex. {'email': {'isEmail':null}, {firsName: {'max':20}}} );
     */
    abstract rules() : {[index:string]:any[]} ;

    /**
     * Returns string of table name for this datatype
     */
    abstract tableName() : string;


    /**
     * Loads data into class instance
     * @param data Object with fieldNames as keys, values as values
     */
    public loadData( data : object ) {
        for (const [ property, value ] of Object.entries(data) ) {
            if (this.hasOwnProperty(property))  {
                this[property].value = value;
            }
        }
    }

    /**
     * Checks rules() to verify input data
     * adds errors if any validation fails
     * returns this.hasError
     * @returns {boolean}
     */
    public verify(sanitize : boolean = true) : boolean {
        for (const [property , rules] of Object.entries(this.rules())) {
            if (!this.hasOwnProperty(property)) { 
                this._addError(property, 'missing', property);
            } else {
                rules.forEach((rule) => {
                    let ruleMethod : string = '';
                    let param      : any;
                    if(typeof(rule) !== 'string') {
                        ruleMethod = Object.keys(rule)[0];
                        param = rule[ruleMethod];    
                    } else {
                        ruleMethod = rule;
                        param = null;
                    }

                    if(!this._checkValidationMethod(this[property], ruleMethod, param)) {
                        this._addError(property, ruleMethod, param);
                    }
                });
            }
        } return !this.hasError();
    }

    /**
     * Connects model database instance to database following config params
     * @param {string} databaseHost
     * @param {string} databaseUsername
     * @param {string} databasePassword 
     * @param {string} datbaseName
     */
    public async connectDatabase(databaseHost : string, databaseUsername : string, databasePassword : string, databaseName : string) {
        this._database.setConfig(databaseHost, databaseUsername, databasePassword, databaseName);
        await this._database.connect();
    }

    /**
     * Closes database connection
     */
    public async closeDatabase() {
        await this._database.close();
    }

    /**
     * Saves all input properties with column names to database
     */
    public async saveToDatabase() : Promise<{[index:string]:any}> {

        const properties = Object.keys(this);
        let insertData : {[index:string]:any} = {};

        properties.forEach((prop) => {
            if(prop[0] !== '_' && this[prop].columnName !== '' && this[prop] instanceof InputProperty) {
                insertData[escapeSql(this[prop].columnName)] = escapeSql(this[prop].value);
            }
        })

        return await this._database.insert(this.tableName(), insertData);
    }

    /**
     * @returns {boolean} true if this object has any errors
     */
    public hasError() : boolean {
        return (Object.keys(this._errors).length > 0);
    }

    /**
     * Returns this._errors
     * @returns {{[index:string]:string}} this._errors
     */
    public getErrors() : {[index:string]:string[]} {
        return this._errors;
    }

    /**
     * Tests validation method of specified rule method
     * @param property Property name
     * @param ruleMethod Name of validation method
     * @param param Param string | number | null
     * @returns True if validation is successful
     */
    private _checkValidationMethod(property : InputProperty, ruleMethod : string, param? : any) : boolean {
        if (!property) return false;
        if(param !== null) {
            // If method is match, get value of match property
            if(ruleMethod === 'match') {
                return ValidationMethods['match'](property.value, this[param].value);
            } else {
                return ValidationMethods[ruleMethod](property.value, param);
            }
        } else {
            // If param is null, don't pass it to method
            return ValidationMethods[ruleMethod](property.value);
        }
    }

    /**
     * Adds error to this.errors
     * @param property Property name
     * @param ruleMethod Method which returned false
     */
    private _addError(property : string, ruleMethod : string, param : any) : void {
        const errorMessage =  (ruleMethod === 'match' ? ValidationMethods._getErrorMessage(ruleMethod,this[param].displayName) : ValidationMethods._getErrorMessage(ruleMethod,param));
        if(this._errors[property] === undefined) this._errors[property] = [errorMessage];
        else if (!this._errors[property].includes(errorMessage)) this._errors[property].push(errorMessage);
    }

}


export { Model, InputProperty, ValidationMethods };