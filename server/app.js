const express = require('express');
const mysql = require('mysql');
const mapKeys = require('lodash/mapKeys');
const camelCase = require('lodash/camelCase');
const startCase = require('lodash/startCase');

const app = express();
const port = 3001;
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'hospital',
  dateStrings: true
});

// Get request body in json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

function formatRecords(results) {
  return results.map(row => mapKeys(Object.assign({}, row), (_, k) => camelCase(k)));
}

function onlyValuesStartCase(results) {
  return results.map(row => Object.assign({}, row)).map(row => startCase(row.Field))
}

function identifyQueryResult(res, query, queryErr, queryRes, queryType) {
  if (queryErr) {
    console.error(`MySQL error-> code: ${queryErr.code}, message: ${queryErr.sqlMessage}`);

    res.status(500).json({
      success: false,
      message: queryErr.message
    });
  } else {
    let result;
    
    // for debugging 
    if (queryType !== 'SHOW')
      console.log('MySQL query OK->', query);

    if (queryType === 'SELECT') {
      result = formatRecords(queryRes);
      // console.log(`Fetched succesfully. Number of records: ${result.length}`);
    } else if (queryType === 'SHOW') {
      result = onlyValuesStartCase(queryRes);
    } else if (queryType === 'UPDATE') {
      result = { success: true, message: `Updated given record successfully` };
    } else if (queryType === 'DELETE') {
      result = { success: true, message: `Deleted given record successfully` };
    } else if (queryType === 'INSERT') {
      result = {
        success: true,
        message: `Added new record successfully`,
        insertId: queryRes.insertId
      };
    }

    res.json(result);
  }
}

function runQuery(res, query, queryType, values) {
  pool.getConnection((connErr, conn) => {
    if (connErr) {
      console.error(`MySQL error-> code: ${connErr.code}, message: ${connErr.sqlMessage}`);

      res.status(500).json({
        success: false,
        message: connErr.message
      });
    }
    // Use the connection
    if (values) {
      conn.query(query, values, (queryErr, queryRes) => {
        identifyQueryResult(res, query, queryErr, queryRes, queryType);
        conn.release();
      });
    } else {
      conn.query(query, (queryErr, queryRes) => {
        identifyQueryResult(res, query, queryErr, queryRes, queryType);
        conn.release();
      });
    }
  });
}

app.get('/', (_req, res) => {
  res.send('The server listening at http://localhost:' + port);
})

app.get('/availableRooms', (_req, res) => {
  runQuery(res, `SELECT * FROM available_rooms`, 'SELECT');
});

app.get('/addresses', (_req, res) => {
  runQuery(res, `SELECT * FROM address`, 'SELECT');
});

app.get('/ongoingTreatments', (_req, res) => {
  runQuery(res, `SELECT * FROM ongoing_treatments`, 'SELECT');
});

app.get('/treatments', (_req, res) => {
  runQuery(res, `SELECT * FROM treatment`, 'SELECT');
});

app.get('/employees', (_req, res) => {
  runQuery(res, `SELECT * FROM hospital.employee`, 'SELECT');
});

app.get('/doctors', (_req, res) => {
  const query = `SELECT employee_id, employee_name FROM hospital.employee WHERE type='doctor'`;
  runQuery(res, query, 'SELECT');
});

app.get('/patients', (_req, res) => {
  runQuery(res, 'SELECT * from show_patients', 'SELECT');
});

app.post('/patient', (req, res) => {
  const doctorId = req.body.doctorId === -1 ? null : req.body.doctorId; 
  const treatmentId = req.body.treatmentId === -1 ? null : req.body.treatmentId; 
  const values = [
    req.body.identityNumber,
    req.body.patientName,
    req.body.contactNo,
    req.body.companionNo,
    req.body.admitDate,
    req.body.discardDate,
    doctorId,
    treatmentId,
  ];
  const query = `
    INSERT INTO hospital.patient (
      identity_number,
      patient_name,
      contact_no,
      companion_no,
      admit_date,
      discard_date,
      doctor_id,
      treatment_id
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);`
  
  runQuery(res, query, 'INSERT', values);
})

app.put('/patient', (req, res) => {
  if (req.query.patientId) {
    const doctorId = req.body.doctorId === -1 ? null : req.body.doctorId; 
    const treatmentId = req.body.treatmentId === -1 ? null : req.body.treatmentId; 
    const values = [
      req.body.identityNumber,
      req.body.patientName,
      req.body.contactNo,
      req.body.companionNo,
      req.body.admitDate,
      req.body.discardDate,
      doctorId,
      treatmentId
    ];
    const query = `
      UPDATE hospital.patient
         SET identity_number = ?,
             patient_name = ?,
             contact_no = ?,
             companion_no = ?,
             admit_date = ?,
             discard_date = ?,
             doctor_id = ?,
             treatment_id = ?
       WHERE patient_id = ${req.query.patientId}`;
  
    runQuery(res, query, 'UPDATE', values);
  } else {
    console.error('No record id given.');
    res.status(400).json({ message: 'Bad Request. Give a record id.' });
  }
})

app.delete('/patient', (req, res) => {
  if (req.query.patientId) {
    const query = `DELETE FROM hospital.patient WHERE patient_id=${req.query.patientId}`;
    runQuery(res, query, 'DELETE');
  } else {
    console.error('No record id given.');
    res.status(400).json({ message: 'Bad Request. Give a record id.' });
  }
})

app.delete('/employee', (req, res) => {
  if (req.query.employeeId) {
    const query = `DELETE FROM hospital.employee WHERE employee_id=${req.query.employeeId}`;
    runQuery(res, query, 'DELETE');
  } else {
    console.error('No record id given.');
    res.status(400).json({ message: 'Bad Request. Give a record id.' });
  }
})

app.get('/attributes', (req, res) => {
  if (req.query.table) {
    runQuery(res, `SHOW COLUMNS FROM ${req.query.table}`, 'SHOW');
  } else {
    console.error('No table name given.');
    res.status(400).json({ message: 'Bad Request. Give a table name.' });
  }
});

const server = app.listen(port, () => {
  console.log(`The server listening at http://localhost:${port}`)
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Closing all connections in the MySQL pool...');
    pool.end((err) => {
      if (err)
        throw new Error('error when closing conecctions in MySQL pool');
      console.log('All connections in the pool have ended');
      console.log('Closed the server');
    });
  });
});