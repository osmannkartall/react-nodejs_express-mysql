# If discard_date of the patient is earlier than current date
# than room assigned to that patient should be inserted as not occupied.
INSERT INTO hospital.room VALUES (1, false, "care room" );
INSERT INTO hospital.room VALUES (2, true, "care room" );
INSERT INTO hospital.room VALUES (3, true, "care room" );
INSERT INTO hospital.room VALUES (4, false, "operation room" );
INSERT INTO hospital.room VALUES (5, false, "operation room" );
INSERT INTO hospital.room VALUES (6, false, "care room" );

INSERT INTO hospital.address VALUES (100, "Los Angeles" , "Siettle", "Downwards", 5, 2);
INSERT INTO hospital.address VALUES (101, "Los Angeles" , "New Cattle", "Downwards", 9, 3);
INSERT INTO hospital.address VALUES (102, "Los Angeles" , "Freddy", "Downwards", 2, 11);
INSERT INTO hospital.address VALUES (103, "Los Angeles" , "Longbeach", "Downwards", 4, 8);
INSERT INTO hospital.address VALUES (104, "Los Angeles" , "Jackony", "Downwards", 4, 9);
INSERT INTO hospital.address VALUES (105, "Los Angeles" , "Shortbeach", "Downwards", 0, 13);
INSERT INTO hospital.address VALUES (106, "Los Angeles" , "Verticci", "Downwards", 1, 22);
INSERT INTO hospital.address VALUES (107, "Los Angeles" , "Horral", "Downwards", 5, 33);
INSERT INTO hospital.address VALUES (108, "Los Angeles" , "Cready", "Downwards", 1, 2);
INSERT INTO hospital.address VALUES (109, "New Jersey" , "Upwards", "Downwards", 3, 0);

INSERT INTO hospital.treatment VALUES (10000, "Two weeks", "Rest");
INSERT INTO hospital.treatment VALUES (10001, "One month", "Drug");
INSERT INTO hospital.treatment VALUES (10002, "Three days", "Dental cleaning");
INSERT INTO hospital.treatment VALUES (10003, "One year", "Chemotherapy");

INSERT INTO hospital.employee VALUES (1, 96727111, 100, "Cory Hintz", "doctor",  15000 );
INSERT INTO hospital.employee VALUES (2, 14782051 , 101, "Elsa Sauer", "doctor",  17000 );
INSERT INTO hospital.employee VALUES (3, 15802472, 102, "Geovanny Beahan Jr.", "doctor",  13000 );
INSERT INTO hospital.employee VALUES (4, 17034905, 103, "Izaiah Orn", "nurse",  4000 );
INSERT INTO hospital.employee VALUES (5, 63158021, 104, "Shayne Schimmel DVM", "nurse",  10000 );
INSERT INTO hospital.employee VALUES (6, 19416678, 105, "Mariela Klocko DDS", "nurse",  7000 );
INSERT INTO hospital.employee VALUES (7, 19936866, 106, "Cordie Emmerich", "nurse",  2500 );

INSERT INTO hospital.patient VALUES (3000, 183759101, "John Conner", 321432424, 907887543, '2010-12-20', '2011-05-08', 1, 10000, 1);
INSERT INTO hospital.patient VALUES (3001, 499088823, "Mary Jane Token", 343622439, 197287547, "2021-11-11", "2022-11-11", 2, 10001, 2);
INSERT INTO hospital.patient VALUES (3002, 908964332, "John Conner", 925430489, 56791772, "2022-08-01", "2022-10-01", 3, 10003, 3);
