import React, { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { baseURL } from '../config';

const Adresses = () => {
  const [adresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch(baseURL + '/addresses')
      .then(res => res.json())
      .then(
        (result) => setAddresses(result),
        (error) => console.log(error)
      );
  }, [])

  return <DataTable name="address" body={adresses} title="Addresses" keyName="addressId"/>;
}

export default Adresses;