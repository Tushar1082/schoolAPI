const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12767253',
    password :'k4cYh2HE5B',
    database: 'sql12767253'
});

conn.connect((err)=>{
    if(err){
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

module.exports = conn;