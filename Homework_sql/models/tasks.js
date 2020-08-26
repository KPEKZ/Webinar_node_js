const mysql = require('mysql');
const config = require('../config.json');
const pool = mysql.createPool(config);


class Task {
    static getAll(tableName) 
    {
       return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();    
                    reject(err);
            
                }

                else
                {
                    connection.query(`SELECT * FROM ${tableName}`, (err, rows) => {
                        if (err) {
                            connection.release();
                            reject(err);
                        }
                        else
                        {
                            const clearRows = JSON.parse(JSON.stringify(rows));
                           
                            connection.release();
                           resolve(clearRows);
                        }
    
                       
                       
                    });
                }

               
            });
        });
    }

    static getById(tableName,id) {

        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();    
                    reject(err);
            
                }

                else
                {
                    connection.query(`SELECT * FROM ${tableName} WHERE id= ?`,id, (err, rows) => {
                        if (err) {
                            connection.release();
                            reject(err);
                        }
                        else
                        {
                            //const clearRows = JSON.parse(JSON.stringify(rows));
                            
                            connection.release();
                           resolve(rows);
                        }
    
                       
                       
                    });
                }

               
            });
        });
            
    }

    static update(tableName, id, name) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();    
                    reject(err);
            
                }

                else
                {
                    connection.query(`UPDATE ${tableName} SET name=? WHERE id=?`,[name,id], (err, rows) => {
                        if (err) {
                            connection.release();
                            reject(err);
                        }
                       
                       
                    });
                }

               
            });
        });
    }

    static createDB(DataBaseName) //создание базы данных
    {
        pool.getConnection((err,connection)=>
        {
            if (err) throw err;
                console.log("Connected!");
               
                
                    connection.query(`CREATE DATABASE ${DataBaseName}`, function (err, result) {
                        if (err) throw err;
                        console.log(`Database: ${DataBaseName} created`);
                      });
                
        })
    }

    static setDataBaseUse(DataBaseName)// установка использования текущей базы данных
    {
        pool.getConnection((err,connection)=>
        {
            if (err) throw err;
                console.log("Connected!");
               
                
                    connection.query(`USE ${DataBaseName}`, function (err, result) {
                        if (err) throw err;
                        console.log(`Database: ${DataBaseName} now using`);
                      });
                
        })
    }

    static createTable(tableName) // создание таблицы //функция с переменным числом параметров
    {
        let result = new String();
        let separator = ',';
        var i;

        for (i = 1; i < arguments.length; i++) {
           
                result += arguments[i];
                if (i>=1 && i!= arguments.length-1)
                    result += separator;
         }

         

        pool.getConnection((err,connection)=>
        {
            if (err) throw err;
                console.log("Connected!");

                
                    connection.query(`CREATE TABLE ${tableName}(${result})`, function (err, result) {
                        if (err) throw err;
                        console.log(`TABLE : ${tableName} created`);
                      });
                
        })

    }

    static showTables()
    {
        pool.getConnection((err,connection)=>
        {
            if (err) {
               
                throw err;
                connection.release();
            }
                console.log("Connected!");
               
                
                    connection.query("SHOW TABLES", function (err, result) {
                        if (err) {
                            connection.release();
                            throw err;
                        }
                        const clearResult = JSON.parse(JSON.stringify(result));
                        

                        console.log("######################")
                        clearResult.forEach(element => {
                            
                            console.log(element.Database)
                            
                        });
                        console.log("######################")
                       
                        
                        connection.release();
                        
                      });
                
        })
    }

    static showDataBases()
    {

        pool.getConnection((err,connection)=>
        {
            if (err) {
                connection.release();
                throw err;
                
            }
                console.log("Connected!");
               
                
                    connection.query("SHOW DATABASES", function (err, result) {
                        if (err) {
                            connection.release();
                            throw err;
                        }
                        const clearResult = JSON.parse(JSON.stringify(result));
                        

                        console.log("######################")
                        clearResult.forEach(element => {
                           
                            someModel.DataBase.push(element.Database);
                         
                        });
                        console.log("######################")
                       
                       
                        connection.release();
                        
                        
                      });
                      
        })
        
    }

    static setRandomId()
    {
        return Math.floor(Math.random()*9999);
    }

    static addUser(dataBase,post) {
        return new Promise(((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();
                    reject(err);
                }
                
                connection.query(`INSERT INTO ${dataBase} SET ?`, post, (err, result) => {
                    if (err) {
                        connection.release();
                        reject(err);
                    }

                   
                    //resolve(result);
                    connection.release();
                    
                   
                });
            });
        }));
    }

    

    static deleteAll(tableName)
    {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();    
                    reject(err);
            
                }

                else
                {
                    connection.query(`DELETE FROM ${tableName}`, (err, rows)=> {
                        if (err) {
                            connection.release();
                            reject(err);
                        }
                       
                    });
                }

               
            });
        });
    }
    

    static delete(tableName,id) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    connection.release();    
                    reject(err);
            
                }

                else
                {
                    connection.query(`DELETE FROM ${tableName} WHERE id=?`,id, (err, rows)=> {
                        if (err) {
                            connection.release();
                            reject(err);
                        }
                       
                    });
                }

               
            });
        });
    }
}

module.exports = Task;