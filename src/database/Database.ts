import { Client } from "https://deno.land/v2.8.0/mysql/mod.ts";

class Database {

    private host : string;
    private user : string;
    private pass : string;
    private name : string;
    
    public connection : Client | null;

    /**
     * Handles database connection and query
     * @param dbHost 
     * @param dbUsername 
     * @param dbPassword 
     * @param dbName 
     */
    constructor(dbHost : string, dbUsername : string, dbPassword : string, dbName : string) {
        this.host = dbHost;
        this.user = dbUsername;
        this.pass = dbPassword;
        this.name = dbName;
        this.connection = null;
    }

    /**
     * Connects to database
     * ---
     */
    async connect() {
        this.connection = await new Client().connect({
            hostname: this.host,
            username: this.user,
            password: this.pass,
            db: this.name,
            poolSize: 3
        });
    }

    /**
     * Inserts data into table
     * ----
     * @param table  
     * @param data   { column : value }
     * @return {Promise<object | null>}
     */
    async insert( table : string , data : object ) : Promise<object | null> {
        let columns = Object.keys(data);
        let values  = Object.values(data); 
        let sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (?${',?'.repeat(values.length -1)})`;
        console.log(`sql : ${sql}`);
        if(this.connection !== null) return this.connection.execute(sql, values);
        return null;
    }

    /**
     * Queries using specified sql statement and paramaters
     * ---
     * @param {string} SQL : SQL string with ? as param placeholders
     * @param {Array<string | number | boolean>} params : params to replace ? placeholders on execute
     * @return {Promise<object | null>} sql response
     */
    async query( SQL : string, params : Array<string | number | boolean> ) : Promise<object | null> {
        if(this.connection !== null) return this.connection.query(SQL, params);
        return null;
    }

}

export { Database };