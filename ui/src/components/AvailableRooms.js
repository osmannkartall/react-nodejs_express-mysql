import React, { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { baseURL } from '../config';

const AvailableRooms = () => {
  const [availableRooms, setAvailableRooms] = useState([]);

  useEffect(() => {
    fetch(baseURL + '/availableRooms')
      .then(res => res.json())
      .then(
        (result) => setAvailableRooms(result),
        (error) => console.log(error)
      );
  }, [])

  return (
    <DataTable
      name="available_rooms"
      body={availableRooms}
      title="Available Rooms"
      keyName="roomId"
    />
  );
}

export default AvailableRooms;