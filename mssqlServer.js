// Notes;
// https://www.geeksforgeeks.org/how-to-connect-sql-server-database-from-javascript-in-the-browser/
// check out this too:
// https://developer.okta.com/blog/2019/03/11/node-sql-server
//
// It seems that the maximum rate is around 10k records per second. Let's see if we can hit that. 
// It would be pretty awesome to have that metric show up on the dial.
// following code comes from:
// https://www.mysqltutorial.org/mysql-nodejs/insert/
// Improve performance in 6 minutes:
// https://www.youtube.com/watch?v=sfe_phPpd6g
// Web worker & web socket example in React:
// https://www.freecodecamp.org/news/how-webworkers-work-in-javascript-with-example/#:~:text=Common%20examples%20of%20web%20workers,huge%20files%20from%20the%20server

// const worker = new Worker(new URL('./worker.js', import.meta.url));
// Requiring modules
const express = require('express');
const app = express();
const mssql = require("mysql");
const { debugPort } = require('process');

// Get request
app.get('/', function (req, res) {

	// Config your database credential
	const config = {
		user: 'talend',
		password: 'Talend123',
		server: 'localhost',
		database: 'DD_TRAINING'
	}

	// Connect to your database
	let connection = mysql.createConnection(config)
	console.log(connection)
	if(connection) console.log('Connected to database: ', config.database)
	else console.log('Cannot connect to database: ', config.database,' on server: ', config.server,' as user: ', config.user)
	// Schema:
	// "DD_ID":"202207271702130000000077","Date_Time":"2022/07/27 17:02:13.000","Receiver":"","Sequence":"0000000077","DD_ACTION":"insert","EMPKEY":77,"PAREMPKEY":163,"SALESTERK":11,"FIRSTNAME":"Douglas","LASTNAME":"Hite","NAMESTYLE":1,"TITLE":"Production Technician - WC45","HIREDATE":"1999/01/28","BIRTHDATE":"1975/12/26","EMAIL":"douglas0@adventure-works.com","PHONE":"808-555-0172","MARITALSTS":"M","GENDER":"M"}
	// so // ID, Date_Time, Receiver, Sequence, DD_ACTION, EMPKEY, PAREMPKEY, SALESTERK, FIRSTNAME, LASTNAME, NAMESTYLE, TITLE, HIREDATE, BIRTHDATE, EMAIL, PHONE, MARITALSTS, GENDER

	//Fields for DD_TRAINING dbo.Customer table in MS SQL Server on Academy VM:
/*
	CREATE TABLE DBO.CUSTOMERS (
	CUSTKEY DECIMAL NOT NULL PRIMARY KEY IDENTITY (1, 1),
	GEOKEY DECIMAL (10,0),
	CUSTALTKEY VARCHAR (15), 
	TITLE VARCHAR (8),
	FIRSTNAME VARCHAR (50),
	LASTNAME VARCHAR (50), 
	BIRTHDATE DATETIME, 
	MARSTATUS VARCHAR (1), 
	SUFFIX VARCHAR (10), 
	GENDER VARCHAR (1), 
	EMAILADDR VARCHAR (50),
	YEARLYINO DECIMAL(19,4),
	NUMBERCHIL DECIMAL(3,0),
	ADDRLINE1 VARCHAR(120),
	ADDRLINE2 VARCHAR (120),
	PHONE VARCHAR (20)
	)
	INSERT '1990-12-12' for datatime
*/
	// // YEARLYINCO, NUMBERCHIL, ADDRLINE1, ADDRLINE2 PHONE
	// For performance, don't cluster the id
	// ALTER TABLE InsertTestTable 
	// ADD CONSTRAINT PrimaryKey_Id
	// PRIMARY KEY NONCLUSTERED (ID)

	// insert statment
	let insertStatement = `INSERT INTO DD_TRAINING title,completed)  VALUES('Learn how to insert a new row', true)`;
	let deleteStatement = `DELETE FROM DD_TRAINING title,completed)  VALUES ?  `
	let todos = [
		['Insert multiple rows at a time', false],
		['It should work perfectly', true]
	];
			
	// execute the insert statment
	connection.query(insertStatement, [todos], (err, results, fields) => {
		if (err) {
			return console.error(err.message);
		}
		// get inserted rows
		console.log('Row inserted:' + results.affectedRows);
	});
	
	// close the database connection
	connection.end();
	});

console.log('Something has run amuck - did you create a database?')
var server = app.listen(5000, function () {
	console.log('Server is listening at port 5000...');
});
