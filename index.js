var express = require('express');
var bodyParser = require('body-parser')
var app = express();
const { Client } = require('pg');
require('dotenv').config({path: '.env'});


app.use(bodyParser.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

client.connect();

//Account Endpoint
app.post('/account/add', (req, res) => {
    client.query(`INSERT INTO salesforce.account (Name, AccountNumber, Rating) VALUES ('${req.body.name}','${req.body.accountnumber}', '${req.body.rating}');`, (err, account) => {
        if (err) throw err;
        for (let row of account.rows) {
          console.log(JSON.stringify(row));
        }
        res.send('Account was created');
      });
});

app.put('/account/modify/:id', (req, res) => {
    client.query(`UPDATE salesforce.account SET Name = '${req.body.name}', AccountNumber = '${req.body.accountnumber}', Rating = '${req.body.rating}' WHERE Id = '${req.params.id}';`, (err, account) => {
        if (err) throw err;
        for (let row of account.rows) {
            console.log(JSON.stringify(row));
        }
        res.send(`Account with id = ${req.params.id} was modified`);
    });
});

//Contact Endpoint
app.get('/contact/list', (req, res) => {
    client.query('SELECT Id, FirstName,LastName,Birthdate FROM salesforce.contact;', (err, contacts) => {
        if (err) throw err;
        for (let row of contacts.rows) {
          console.log(JSON.stringify(row));
        }
       // client.end();
        res.json(contacts.rows);
      });
});


app.get('/contact/view/:id', (req, res) => {
    client.query(`SELECT Id,sfid, FirstName,LastName,Birthdate FROM salesforce.contact WHERE Id=${req.params.id};`, (err, contacts) => {
        if (err) throw err;
        for (let row of contacts.rows) {
          console.log(JSON.stringify(row));
        }
       // client.end();
        res.json(contacts.rows[0]);
      });
});

app.post('/contact/add', (req, res) => {
    client.query(`SELECT Id,sfid, FirstName, LastName, Birthdate FROM salesforce.contact WHERE Email='${req.body.email}';`, (err, getContacts) => {
        if (err) throw err;

        for (let row of getContacts.rows) {
          console.log(JSON.stringify(row));
        }

        if(getContacts.rows.length == 0) {
            client.query(`INSERT INTO salesforce.contact (FirstName, LastName, Email) VALUES ('${req.body.firstname}', '${req.body.lastname}', '${req.body.email}');`, (err, insertedContacts) => {
                if (err) throw err;
                for (let row of insertedContacts.rows) {
                  console.log(JSON.stringify(row));
                }
                res.send(`Contact with Email = ${req.body.email} was created`);
              });
              console.log('Adding a new contact')
        } else {
            client.query(`UPDATE salesforce.contact SET sfid = '${getContacts.rows[0].sfid}', FirstName = '${req.body.firstname}', LastName='${req.body.lastname}' WHERE Email = '${req.body.email}';`, (err, updatedContacts) => {
                if (err) throw err;
                for (let row of updatedContacts.rows) {
                    console.log(JSON.stringify(row));
                }
                console.log(`contact already exists, updated salesforce id with ${getContacts.rows[0].sfid}`);
                res.send(`Contact already exists, updated salesforce id with ${getContacts.rows[0].sfid}`);
            });
        }
    });
});

app.put('/contact/modify/:id', (req, res) => {
    client.query(`UPDATE salesforce.contact SET FirstName = '${req.body.firstname}', LastName='${req.body.lastname}', Email='${req.body.email}' WHERE Id = '${req.params.id}';`, (err, contacts) => {
        if (err) throw err;
        for (let row of contacts.rows) {
            console.log(JSON.stringify(row));
        }
        res.send(`Contact with id = ${req.params.id} was modified`);
    });
});

app.delete('/contact/delete/:id', (req, res) => {
    client.query(`DELETE FROM salesforce.contact WHERE Id = '${req.params.id}';`, (err, contacts) => {
        if (err) throw err;
        for (let row of contacts.rows) {
            console.log(JSON.stringify(row));
        }
        res.send(`Contact with id = ${req.params.id} was deleted`);
    });
});


//Contract Endpoint
app.post('/contract/add', (req, res) => {
    client.query(`INSERT INTO salesforce.contract (AccountId,ContractTerm, Status, StartDate) VALUES ('${req.body.accountid}','${req.body.contractterm}', '${req.body.status}', '${req.body.startdate}');`, (err, contracts) => {
        if (err) throw err;
        for (let row of contracts.rows) {
          console.log(JSON.stringify(row));
        }
        res.send('Contract was created');
      });
});

app.put('/contract/modify/:id', (req, res) => {
    client.query(`UPDATE salesforce.contact SET AccountId = 'req.body.accountid}', ContractTerm='req.body.contractterm', Status='req.body.status', StartDate='req.body.startdate' WHERE Id = '${req.params.id}';`, (err, contacts) => {
        if (err) throw err;
        for (let row of contacts.rows) {
            console.log(JSON.stringify(row));
        }
        res.send(`Contract with id = ${req.params.id} was modified`);
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Example app is listening on port 3000.'));