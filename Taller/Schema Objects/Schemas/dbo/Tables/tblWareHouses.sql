﻿CREATE TABLE tblWareHouses
(
Id INT PRIMARY KEY,
[Name] VARCHAR(500),
Active BIT,
HasMovements BIT,
CreationDate DATETIME DEFAULT GETDATE()
)