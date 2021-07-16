import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Paper
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { baseURL } from '../config';

const useStyles = makeStyles({
  tableContainer: {
    maxWidth: '100%',
    overflow: 'auto'
  },
  headContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent : 'space-between',
    alignItems: 'center',
  },
});

const DataTable = ({ name, body, title, keyName, operations, scrollable }) => {
  const [headers, setHeaders] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    fetch(baseURL + `/attributes?table=${name}`)
      .then(res => res.json())
      .then(
        (result) => setHeaders(result),
        (error) => console.log(error)
      );
  }, [name])

  return (
    <>
      <div className={classes.headContainer}>
        <h1>{title}</h1>
        {operations && operations.add ? (
          <Button variant="contained" color="primary" onClick={operations.addHandler}>add</Button>
        ) : null}
      </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table style={scrollable ? {width: '150%'} : null} size="small" aria-label="a dense table">
          <TableHead>
            {headers && headers.length ? (
              <TableRow>
                {operations && (operations.delete || operations.update) ? (
                  <TableCell align="left"/>
                ) : null}
                {headers.map((attribute) => (
                  <TableCell key={attribute} align="center">{attribute}</TableCell>
                ))}
              </TableRow>
            ) : null}
          </TableHead>
          <TableBody>
            {body && body.length ? (
              body.map((row) => (
                <TableRow key={row[keyName]}>
                  {operations && (operations.delete || operations.update) ? ( 
                    <TableCell align="left">
                      {operations.update ? (
                        <IconButton
                          style={{ marginRight: 15 }}
                          onClick={() => operations.updateHandler(row[keyName])}
                        >
                          <CreateIcon style={{ color: 'orange' }} />
                        </IconButton>
                      ) : null}
                      {operations.delete ? (
                        <IconButton onClick={() => operations.deleteHandler(row)}>
                          <DeleteIcon color="secondary" />
                        </IconButton>
                      ) : null}
                    </TableCell>
                  ) : null}
                  {Object.getOwnPropertyNames(row).map((attribute) => (
                    <TableCell key={attribute} align="center">{row[attribute]}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DataTable;