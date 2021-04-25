

const ValidationMethods : {[index: string]: any} = (() => {

    // let extraMethods : {[index: string]: Function} = {};

    // function _addMethod(methodName : string, method : Function) {
    //     extraMethods[methodName] = method;
    // }

    /**
     * Tests if input is valid email address
     * @param testValue Email input string
     * @returns True if input is valid email
     */
    function isEmail(testValue : string) : boolean {
        let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regex.test(testValue);
    }

    /**
     * Tests if input string is longer than max amount
     * @param {string} testValue Input string
     * @param {number} maxAmount Max length of string
     * @returns True if input is less than or equal to max
     */
    function max(testValue : string, maxAmount : number) : boolean {
        if (typeof(testValue) === 'string')
            return ( testValue.length <= maxAmount ); 
        else /*if number*/ 
            return ( testValue <= maxAmount );
    }

    /**
     * Tests if input string is shorter than min amount
     * @param testValue Input
     * @param minAmount Min length of string | Min value of number
     * @returns True if input is higher than or equal to value specified
     */
    function min(testValue : string|number, minAmount : number) : boolean {
        if (typeof(testValue) === 'string')
            return ( testValue.length >= minAmount ); 
        else /*if number*/ 
            return ( testValue >= minAmount );
    }

    /**
     * Tests if number is greater than max amount
     * @param {number} testValue 
     * @param {number} maxAmount 
     * @returns {boolean} true if number is less than or equal to min amount
     */
    function maxNum(testValue : number, maxAmount : number) : boolean {
        return (testValue <= maxAmount);
    }

    /**
     * Tests if number is less than min amount
     * @param {number} testValue 
     * @param {number} minAmount 
     * @returns {boolean} true if number is greater than or equal to min amount
     */
    function minNum(testValue : number, minAmount : number) : boolean {
        return (testValue >= minAmount)
    }

    /**
     * Tests if two strings match
     * @param testValue Input string
     * @param matchString Value of property to match
     * @returns True if values match
     */
    function match(testValue : string|number, matchString : string) : boolean {
        return (testValue === matchString);
    }

    /**
     * Returns true if input is not empty
     * @param testValue input 
     * @returns true if input is not empty
     */
    function required(testValue : any) : boolean {
        if (!testValue) return false;
        if(typeof(testValue) === 'string') {
            return (testValue.length > 0);
        } else if (typeof(testValue === 'number')) {
            return true;
        } else return false;
    }

    /**
     * 
     * @param {string} ruleMethod name of rule error was triggered by
     * @param {any} param depends on ruleMethod | number, InputProperty, null 
     * @returns {string} Error message
     */
    function _getErrorMessage(ruleMethod : string, param : any) : string {
        switch(ruleMethod) {
            case('isEmail'):
                return `Must be a valid email.`;
            case('max'):
                return `Must be less than ${param} characters.`;
            case('min'):
                return `Must be at least ${param} characters.`;
            case('maxNum'):
                return `Must be less than ${param}.`;
            case('minNum'):
                return `Must be at least ${param}.`;
            case('match'):
                return `Must match ${param}.`;
            case('required'):
                return `Required.`;
            case('missing'):
                return `Missing ${param}.`;
            default: return `void`;
        }

    }

    return {
        // _addMethod: _addMethod,
        isEmail : isEmail,
        max     : max,
        min     : min,
        maxNum  : maxNum,
        minNum  : minNum,
        match   : match,
        required: required,
        
        _getErrorMessage: _getErrorMessage
    };

})();

export default ValidationMethods;