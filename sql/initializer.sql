CREATE SCHEMA IF NOT EXISTS hospital;

CREATE TABLE hospital.room (
	room_id   INT,
	occupancy BOOL,
	room_type VARCHAR(40) NOT NULL,
	PRIMARY KEY (room_id)
);

CREATE TABLE hospital.address (
	address_id INT,
	city       VARCHAR(40) NOT NULL,
    town       VARCHAR(40) NOT NULL,
    street     VARCHAR(40) NOT NULL,
    apt_no     INT,
    door       INT,
	PRIMARY KEY (address_id)
);

CREATE TABLE hospital.treatment (
	treatment_id INT,
	period       VARCHAR(40) NOT NULL,
    description  VARCHAR(100) NOT NULL,
	PRIMARY KEY (treatment_id)
);

CREATE TABLE hospital.employee (
	employee_id   INT,
	contact_no    INT,
    address_id    INT,
    employee_name VARCHAR(40) NOT NULL,
    type           VARCHAR(40) NOT NULL,
    base_salary   INT,
    PRIMARY KEY (employee_id),
	FOREIGN KEY (address_id)
	    REFERENCES address(address_id)
		ON DELETE SET NULL
);

CREATE TABLE hospital.patient (
	patient_id      INT AUTO_INCREMENT,
	identity_number INT,
	patient_name    VARCHAR(40) NOT NULL,
    contact_no      INT,
    companion_no    INT,
    admit_date      DATE NOT NULL,
    discard_date    DATE NOT NULL,
    room_id         INT,
    treatment_id    INT,
    doctor_id       INT,
    PRIMARY KEY (patient_id),
	FOREIGN KEY (room_id)
	    REFERENCES room(room_id)
		ON DELETE SET NULL,
	FOREIGN KEY (treatment_id)
	    REFERENCES treatment(treatment_id)
		ON DELETE SET NULL,
	FOREIGN KEY (doctor_id)
	    REFERENCES employee(employee_id)
  		ON DELETE SET NULL
);

