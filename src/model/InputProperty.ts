/**
 * To be used with Model,
 * data structure for input properties
 */
 class InputProperty {

    public  value : string|number|undefined;
    public  displayName  : string;
    public  columnName   : string;

    /**
     * @param displayName Display name for input property
     * @param columnName  SQL column name
     */
    constructor(displayName : string, columnName? : string) {
        this.displayName  = displayName;
        this.columnName   = columnName || '';
    }

}

export default InputProperty;