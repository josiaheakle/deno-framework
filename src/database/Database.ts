import { Client } from "../../deps.ts";

class Database {

    private host : string;
    private user : string;
    private pass : string;
    private name : string;
    
    public connection : Client;

    /**
     * Handles database connection and query
     * @param dbHost 
     * @param dbUsername 
     * @param dbPassword 
     * @param dbName 
     */
    constructor(dbHost? : string, dbUsername? : string, dbPassword? : string, dbName? : string) {
        this.host = dbHost ?? '';
        this.user = dbUsername ?? '';
        this.pass = dbPassword ?? '';
        this.name = dbName ?? '';
        this.connection = new Client();
    }

    setConfig(dbHost : string, dbUsername : string, dbPassword : string, dbName : string) {
        this.host = dbHost;
        this.user = dbUsername;
        this.pass = dbPassword;
        this.name = dbName;
    }

    /**
     * Connects to database
     * ---
     */
    async connect() : Promise<void> {
        this.connection = await this.connection.connect({
            hostname: this.host,
            username: this.user,
            password: this.pass,
            db: this.name,
            poolSize: 3
        });
    }

    /**
     * Closes current connection
     */
    async close() {
        return await this.connection.close();
    }

    /**
     * Inserts data into table
     * ----
     * @param table  
     * @param data   { column : value }
     * @return {Promise<{[index:string]:any}>}
     */
    async insert( table : string , data : object ) : Promise<{[index:string]:any}> {
        let columns = Object.keys(data);
        let values  = Object.values(data); 
        let sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (?${',?'.repeat(values.length -1)})`;
        let res : {[index:string]:any} = await this.connection.execute(sql, values);
        return res;
    }

    /**
     * Queries using specified sql statement and paramaters
     * ---
     * @param {string} SQL : SQL string with ? as param placeholders
     * @param {Array<string | number | boolean>} params : params to replace ? placeholders on execute
     * @return {Promise<{[index:string]:any}>} sql response
     */
    async query( SQL : string, params : Array<string | number | boolean> ) : Promise<{[index:string]:any}>  {
        let res : {[index:string]:any} = await this.connection.query(SQL, params);
        return res;
    }

}

export { Database };