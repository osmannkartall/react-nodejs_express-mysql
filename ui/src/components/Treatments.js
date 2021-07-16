import React, { useEffect, useState } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import DataTable from './DataTable';
import { baseURL } from '../config';

const Treatment = () => {
  const [treatments, setTreatments] = useState([]);
  const [ongoingTreatments, setOngoingTreatments] = useState([]);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    fetch(baseURL + '/treatments')
      .then(res => res.json())
      .then(
        (result) => setTreatments(result),
        (error) => console.log(error)
      );
  }, [])

  useEffect(() => {
    fetch(baseURL + '/ongoingTreatments')
      .then(res => res.json())
      .then(
        (result) => setOngoingTreatments(result),
        (error) => console.log(error)
      );
  }, [])

  return (
    <>
      <DataTable name="treatment" body={treatments} title="Treatment Types" keyName="treatmentId"/>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked.checkedB}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        style={{ marginTop: '10px' }}
        label="Show Ongoing Treatments"
      />
      {checked ? (
        <DataTable
          name="ongoing_treatments"
          body={ongoingTreatments}
          title="Ongoing Treatments"
          keyName="treatmentId"
        />
      ) : null}
    </>
  );
}

export default Treatment;