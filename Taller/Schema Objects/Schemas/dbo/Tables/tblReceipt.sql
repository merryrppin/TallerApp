﻿CREATE TABLE tblReceipt
(
ReceiptId UNIQUEIDENTIFIER PRIMARY KEY,
[Name] VARCHAR(100),
CreationDate DATE DEFAULT GETDATE(),
CreatedBy VARCHAR(100)
)