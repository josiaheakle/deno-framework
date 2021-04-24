import ValidationMethods from "./ValidationMethods.ts";
import InputProperty from "./InputProperty.ts";

abstract class Model  {
    [index: string]: any

    /*
     * Set input fields to public properties as InputProperty objects with 
     * same names as object keys in loadData.
     * this.load will load data into properties, 
     * this.verify will check rules set in this.rules
     * to verify input matches specified rules, adds errors to this.errors instance
     */


    public errors   : {[index: string]:Array<string>}  = {};

    /**
     * Returns object with input properties as first key, 
     * with rule methods and param as own object key value pair of first value
     * ---
     * @return {object} (ex. {'email': {'isEmail':null}, {firsName: {'max':20}}} );
     */
    abstract rules() : {[index:string]:{[index:string]:any}};

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
    public verify() : boolean {

        for (const [property , rule] of Object.entries(this.rules())) {
            for (const [ ruleMethod, param ] of Object.entries(rule) ) {
                if (!this.hasOwnProperty(property)) { 
                    this._addError(property, 'missing', property);
                } else if(!this._checkValidationMethod(this[property], ruleMethod, param)) {
                    this._addError(this[property], ruleMethod, param);
                }
            }
        }
        return !this.hasError();
    }

    /**
     * @returns {boolean} true if this object has any errors
     */
    public hasError() : boolean {
        return (Object.keys(this.errors).length > 0);
    }

    /**
     * Tests validation method of specified rule method
     * @param property Property name
     * @param ruleMethod Name of validation method
     * @param param Param string | number | null
     * @returns True if validation is successful
     */
    private _checkValidationMethod(property : InputProperty, ruleMethod : string, param : any) : boolean {
        if (property === undefined) return false;
        if(param !== null) {
            
            // If method is match, get value of match property
            let ret : any = undefined;
            if(ruleMethod === 'match') {
                return ValidationMethods.match(property.value, this[param].value);
            } else {
                return ValidationMethods[ruleMethod](property.value, param);
            }
            // Else call validation method rule with property value as first arg
            // else return ((ValidationMethods.extraMethods[ruleMethod](property.value, param)));
        } else {
            // If param is null, don't pass it to method
            return ValidationMethods[ruleMethod](property.value) ?? (ValidationMethods.extraMethods[ruleMethod](property.value));
        }
    }

    /**
     * Adds error to this.errors
     * @param property Property name
     * @param ruleMethod Method which returned false
     */
    private _addError(property : InputProperty|string, ruleMethod : string, param : any) : void {
        let propStr : string = '';
        if(typeof(property) === 'string') { 
            propStr = property;
        }
        else propStr = property.displayName ?? '';
        const errorMessage = ValidationMethods._getErrorMessage(ruleMethod,param);
        if(this.errors[propStr] === undefined) this.errors[propStr] = [errorMessage];
        else if (!this.errors[propStr].includes(errorMessage)) this.errors[propStr].push(errorMessage);
        
    }

}


export { Model, InputProperty, ValidationMethods };