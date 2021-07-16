CREATE VIEW available_rooms AS
     SELECT room_id, room_type
       FROM hospital.room
      WHERE occupancy = false;

CREATE VIEW ongoing_treatments AS
     SELECT hospital.treatment.treatment_id,
	        hospital.patient.patient_name,
            hospital.patient.discard_date,
            hospital.treatment.description,
            hospital.treatment.period
       FROM hospital.patient
 INNER JOIN hospital.treatment
         ON hospital.patient.treatment_id = hospital.treatment.treatment_id
      WHERE hospital.patient.discard_date > CURRENT_TIMESTAMP();

CREATE VIEW show_patients AS
     SELECT t.patient_id,
            t.identity_number,
            t.patient_name,
            t.contact_no,
            t.companion_no,
            t.admit_date,
            t.discard_date,
            t.room_id,
            employee.employee_name as 'Doctor',
            t.description as 'Treatment'
       FROM (
               SELECT patient.*,
                      treatment.description
                 FROM hospital.patient
            LEFT JOIN hospital.treatment
                   ON patient.treatment_id = treatment.treatment_id
       ) AS t
  LEFT JOIN hospital.employee
         ON t.doctor_id = employee.employee_id;
      
           
