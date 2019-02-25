import mysql from 'mysql';
import squel from 'squel';
import util from 'util';
export default class dbProvider {
    constructor({connection}){
        if(connection.driver === 'mysql'){
            this.pool = mysql.createPool({
                connectionLimit: connection.connectionLimit || 10,
                ...connection
            })
            this.pool.query = util.promisify(this.pool.query)
            this.pool.getConnection((err, connection) => {
                if (err) {
                    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                        console.error('Database connection was closed.')
                    }
                    if (err.code === 'ER_CON_COUNT_ERROR') {
                        console.error('Database has too many connections.')
                    }
                    if (err.code === 'ECONNREFUSED') {
                        console.error('Database connection was refused.')
                    }
                }
                if (connection) connection.release()
                return
            })
        }
        return this
    }
    squel(){
        return squel
    }
    exec(query){
        if(typeof query === 'string'){

            return this.pool.query( query )

        }else{

            let params = query.toParam()
            return this.pool.query( params.text,params.values )

        }
    }
    select(){
        return squel.select()
    }
    insert(){
        return squel.insert()
    }
    update(){
        return squel.update()
    }
    delete(){
        return squel.delete()
    }
}
