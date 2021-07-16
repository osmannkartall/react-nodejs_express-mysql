import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import DataTable from './DataTable';
import { baseURL } from '../config';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [alertDialog, setAlertDialog] = useState({ success: false, message: '' });

  useEffect(() => {
    fetch(baseURL + '/employees')
      .then(res => res.json())
      .then(
        (result) => setEmployees(result),
        (error) => console.log(error)
      );
  }, []);

  const deleteEmployee = (employee) => {
    const employeesTemp = [...employees]; 
    const index = employeesTemp.indexOf(employee);
    
    if (index !== -1) {
      const id = employeesTemp[index].employeeId;
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };

      fetch(baseURL + `/employee?employeeId=${id}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            if (result.success) {
              employeesTemp.splice(index, 1);
              setEmployees(employeesTemp);
              setAlertDialog({ success: true, message: result.message });
            } else {
              setAlertDialog({ success: false, message: result.message });
            }
            document.documentElement.scrollTop = 0;
          },
          (error) => console.log(error)
        );
    }
  }

  return (
    <>
      {alertDialog.message ? (
        <Alert 
          severity={!alertDialog.success ? "error" : "success"}
          onClose={() => setAlertDialog({ ...alertDialog, message: null })}
        >
          <AlertTitle>{!alertDialog.success ? 'Error' : 'Success'}</AlertTitle>
          {alertDialog.message}
        </Alert>
      ) : null}
      <DataTable 
        name="employee"
        body={employees}
        title="Employees"
        keyName="employeeId"
        operations={{
          'delete': true,
          'deleteHandler': deleteEmployee
        }}
      />
    </>
    
  );
}

export default Employees;