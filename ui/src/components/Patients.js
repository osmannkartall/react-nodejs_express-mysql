import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  makeStyles
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import DataTable from './DataTable';
import { baseURL } from '../config';

const useStyles = makeStyles({
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent : 'center',
  },
  form: {
    width: "60%",
    borderRadius: '10px',
    boxShadow: '0px 0px 2px 2px #d4d4d4',
    padding: 20
  },
  formHeadContainer: {
    width: "60%",
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header: {
    textAlign: 'center',
  },
  submit: {
    marginTop: 30,
  },
  select: {
    display: 'flex',
    width: '100%'
  }
});

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [updatedId, setUpdatedId] = useState(null);
  const [operationTitle, setOperationTitle] = useState('');
  const [alertDialog, setAlertDialog] = useState({success: false, message: ''});
  // form inputs  
  const [patientName, setPatientName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [doctorId, setDoctorId] = useState(-1);
  const [treatmentId, setTreatmentId] = useState(-1);
  const [contactNo, setContactNo] = useState('');
  const [companionNo, setCompanionNo] = useState('');
  const [admitDate, setAdmitDate] = useState('');
  const [discardDate, setDiscardDate] = useState('');

  const classes = useStyles();

  useEffect(() => {
    fetch(baseURL + '/patients')
      .then(res => res.json())
      .then(
        (result) => setPatients(result),
        (error) => console.log(error)
      );

    fetch(baseURL + '/doctors')
      .then(res => res.json())
      .then(
        (result) => setDoctors(result),
        (error) => console.log(error)
      );
    
    fetch(baseURL + '/treatments')
      .then(res => res.json())
      .then(
        (result) => setTreatments(result),
        (error) => console.log(error)
      );
  }, [])

  const deletePatient = (patient) => {
    const patientsTemp = [...patients]; 
    const index = patientsTemp.indexOf(patient);
    
    if (index !== -1) {
      const id = patientsTemp[index].patientId;
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      };

      fetch(baseURL + `/patient?patientId=${id}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            if (result.success) {
              patientsTemp.splice(index, 1);
              setPatients(patientsTemp);
              setAlertDialog({ success: true, message: result.message });
              setUpdatedId(null);
              setShowForm(false);
            } else {
              setAlertDialog({ success: false, message: result.message });
            }
            document.documentElement.scrollTop = 0;
          },
          (error) => console.log(error)
        );
    }
  }

  const getDoctorId = (name) => {
    const doctor = doctors.find((d) => d.employeeName === name);
    return doctor ? doctor['employeeId'] : -1;
  }

  const getDoctorName = (id) => {
    const doctor = doctors.find((d) => d.employeeId === id);
    return doctor ? doctor['employeeName'] : '';
  }

  const getTreatmentId = (description) => {
    const treatment = treatments.find((t) => t.description === description);
    return treatment ? treatment['treatmentId'] : -1;
  }
  
  const getTreatmentDescription = (id) => {
    const treatment = treatments.find((t) => t.treatmentId === id);
    return treatment ? treatment['description'] : '';
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = {
      patientName,
      identityNumber,
      contactNo,
      companionNo,
      admitDate,
      discardDate,
      doctorId,
      treatmentId
    };

    if (updatedId) {
      const tempPatients = [...patients];
      const i = tempPatients.findIndex(p => p.patientId === updatedId);
      
      if (i !== -1) {
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        };

        fetch(baseURL + `/patient?patientId=${tempPatients[i].patientId}`, requestOptions)
          .then(res => res.json())
          .then(
            (result) => {
              if (result.success) {
                tempPatients[i].patientName = form.patientName;
                tempPatients[i].identityNumber = form.identityNumber;
                tempPatients[i].contactNo = form.contactNo;
                tempPatients[i].companionNo = form.companionNo;
                tempPatients[i].admitDate = form.admitDate;
                tempPatients[i].discardDate = form.discardDate;
                tempPatients[i].doctor = getDoctorName(form.doctorId);
                tempPatients[i].treatment = getTreatmentDescription(form.treatmentId);
                setPatients(tempPatients);
                setAlertDialog({ success: true, message: result.message });
              } else {
                setAlertDialog({ success: false, message: result.message });
              }
              document.documentElement.scrollTop = 0;
            },
            (error) => console.log(error)
          );
      }
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      };

      fetch(baseURL + '/patient', requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            if (result.success) {
              const tempPatients = [...patients];
              tempPatients.push({
                patientId: result.insertId,
                patientName: form.patientName,
                identityNumber: form.identityNumber,
                contactNo: form.contactNo,
                companionNo: form.companionNo,
                admitDate: form.admitDate,
                discardDate: form.discardDate,
                roomId: null,
                doctor: getDoctorName(form.doctorId),
                treatment: getTreatmentDescription(form.treatmentId)
              });
              setPatients(tempPatients);
              setAlertDialog({ success: true, message: result.message });
            } else {
              setAlertDialog({ success: false, message: result.message });
            }
            document.documentElement.scrollTop = 0;
          },
          (error) => console.log(error)
        );
    }
    setUpdatedId(null);
    setShowForm(false);
  };

  const updatePatient = (patientId) => {
    const patient = patients.find(p => p.patientId === patientId);
    
    setOperationTitle('Edit Patient');
    if (patient) {
      setPatientName(patient.patientName);
      setIdentityNumber(patient.identityNumber);
      setContactNo(patient.contactNo);
      setCompanionNo(patient.companionNo);
      setAdmitDate(patient.admitDate);
      setDiscardDate(patient.discardDate);
      setDoctorId(getDoctorId(patient.doctor));
      setTreatmentId(getTreatmentId(patient.treatment));
      setUpdatedId(patientId);
      setShowForm(true);
    }
  };
  
  const onClickAdd = () => {
    setOperationTitle('New Patient');
    
    // reset form elements
    setPatientName('');
    setIdentityNumber('');
    setContactNo('');
    setCompanionNo('');
    setAdmitDate('');
    setDiscardDate('');
    setDoctorId(-1);
    setTreatmentId(-1);
    
    setUpdatedId(null);
    setShowForm(true);
  };

  const onClickCancel = () => {
    setShowForm(false);
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
        name="show_patients"
        body={patients}
        title="Patients"
        keyName="patientId"
        operations={{
          'add': true,
          'addHandler': onClickAdd,
          'update': true,
          'updateHandler': updatePatient,
          'delete': true,
          'deleteHandler': deletePatient
        }}
        scrollable
      />
      <p>
        * The rooms shown as reserved for a patient in the table are empty
        if that patient's discard date has passed.
      </p>
      {showForm ? (
        <>
          <div className={classes.formContainer}>
            <div className={classes.formHeadContainer}>
              <h1 className={classes.header}>{operationTitle}</h1>
              <Button variant="outlined" color="secondary" onClick={() => onClickCancel()}>
                Cancel
              </Button>
            </div>
          </div>
          <div className={classes.formContainer}>
            <form className={classes.form} noValidate onSubmit={(e) => handleSubmit(e)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="patientName"
                    variant="outlined"
                    required
                    fullWidth
                    id="patientName"
                    label="Patient Name"
                    autoFocus
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="identityNumber"
                    label="Identity Number"
                    name="identityNumber"
                    value={identityNumber}
                    onChange={(e) => setIdentityNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" className={[classes.formControl, classes.select]}>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                      label="Doctor"
                    >
                      <MenuItem value={-1}><em>Empty</em></MenuItem>
                      { 
                        doctors.map((d) => {
                          return (
                            <MenuItem
                              key={d.employeeId}
                              value={d.employeeId}
                            >
                              {d.employeeName}
                            </MenuItem> 
                          );
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" className={[classes.formControl, classes.select]}>
                    <InputLabel>Treatment</InputLabel>
                    <Select
                      value={treatmentId}
                      onChange={(e) => setTreatmentId(e.target.value)}
                      label="Treatment"
                    >
                      <MenuItem value={-1}><em>Empty</em></MenuItem>
                      { 
                        treatments.map((t) => {
                          return ( 
                            <MenuItem
                              key={t.treatmentId}
                              value={t.treatmentId}
                            >
                              {t.description}
                            </MenuItem> 
                          );
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="contactNo"
                    variant="outlined"
                    required
                    fullWidth
                    id="contactNo"
                    label="Contact No"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="companionNo"
                    label="Companion No"
                    name="companionNo"
                    value={companionNo}
                    onChange={(e) => setCompanionNo(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="admitDate"
                    variant="outlined"
                    required
                    fullWidth
                    id="admitDate"
                    label="Admit Date"
                    value={admitDate}
                    onChange={(e) => setAdmitDate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="discardDate"
                    label="Discard Date"
                    name="discardDate"
                    value={discardDate}
                    onChange={(e) => setDiscardDate(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Patients;