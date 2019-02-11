import mysql from 'mysql'

export default class dbProvider {
     constructor( {connection} ) {
        if(connection.driver === 'mysql'){
            this.pool = mysql.createPool({
                connectionLimit: 10,
                ...connection
            })
        }
        return this
    }
    exec(sql){
        return self.pool.query(sql)
    }
    
}