# react-nodejs_express-mysql

A simple project that demonstrates React, Node.js and MySQL in action.
## Architecture

<p align="center">
  <img style="align: center;" src="https://github.com/osmannkartall/react-nodejs_express-mysql/blob/master/docs/architecture.png" />
</p>

**Client:** React
- [material-ui](https://github.com/mui-org/material-ui): components(Table, inputs ...)

**Server:** Node
- [express](https://github.com/expressjs/express): http server

**Database:** MySQL
## Instructions

Clone the project.
```bash
  git clone https://github.com/osmannkartall/react-nodejs_express-mysql
```

#### MySQL

- [Install MySQL Shell depending on your OS.](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-install.html)
- [Install MySQL Server only with web community version link.](https://dev.mysql.com/downloads/installer/) You can select MySQL 8.0.25. Leave connectivity port as 3306
- Make sure that status of MySQL server service is running on your OS.

Creating the Database
```bash
  # Windows(e.g. run the commands in cmd)

  1. mysqlsh --mysql --uri root@localhost:3306
  2. # Please provide the password for 'root@localhost:3306':
     > password
  3. # Save password for 'root@localhost:3306'? [Y]es/[N]o/Ne[v]er (default No):
     > y
  4. \sql
  5. \connect root@localhost:3306
  6. source <path-of-the-initializer.sql>
  7. use hospital;
  8. source <path-of-the-trigger.sql>
  9. source <path-of-the-view.sql>
  10. source <path-of-the-insert.sql>
  11. # run a query on hospital schema for testing
     > select * from employee;
  12. # run the query to avoid the error with ER_NOT_SUPPORTED_AUTH_MODE code when trying to connect Node.js to MySQL
     > ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

#### React

Install dependencies with npm.
```bash
  cd react-nodejs_express-mysql/ui
  npm install
```

Start the project.
```bash
  npm start
```

#### Node.js

Install dependencies with npm.
```bash
  cd react-nodejs_express-mysql/server
  npm install
```

Start the project.
```bash
  nodemon app.js
```
## Demo

https://drive.google.com/file/d/10fFVRAlbf96IfunEcE8R1fXW--nDazgY/view
