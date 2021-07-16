# Delete all the records related to deleted employee.
DROP TRIGGER IF EXISTS hospital.delete_employee;
DELIMITER $$
CREATE TRIGGER hospital.delete_employee BEFORE DELETE ON hospital.employee
FOR EACH ROW
	BEGIN
		SET @address_id = (
			SELECT address_id
			  FROM hospital.employee
			 WHERE old.employee_id = hospital.employee.employee_id
		);

		DELETE 
		  FROM hospital.address
		 WHERE @address_id = hospital.address.address_id;
	END$$
DELIMITER ;

# Assign an empty room to new patient before inserting new patient.
DROP TRIGGER IF EXISTS hospital.update_room_on_insert_patient;
DELIMITER $$
CREATE TRIGGER hospital.update_room_on_insert_patient BEFORE INSERT ON hospital.patient
FOR EACH ROW
    BEGIN
        SET @empty_room = (
            SELECT MIN(room_id)
              FROM hospital.room
             WHERE occupancy = false
        );

        IF @empty_room IS NOT NULL THEN 
			SET new.room_id = @empty_room;
			
			UPDATE room
			   SET room.occupancy = true
			 WHERE room.room_id = @empty_room;
        END IF;
    END$$
DELIMITER ;

# Set the room available after deleting the patient.
DROP TRIGGER IF EXISTS hospital.update_room_on_delete;
DELIMITER $$
CREATE TRIGGER hospital.update_room_on_delete BEFORE DELETE ON hospital.patient
FOR EACH ROW
	BEGIN
		SET @old_patient_id = old.patient_id;
		SET @old_room_id = (
			SELECT room_id
			  FROM hospital.patient
			 WHERE patient_id = @old_patient_id
		);
		
		UPDATE room
		   SET room.occupancy = false
		 WHERE room.room_id = @old_room_id
		   AND old.discard_date >= CURDATE();
	END$$
DELIMITER ;
