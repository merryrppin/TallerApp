CREATE TABLE tblAccountingReceiptTypes
(
Id INT PRIMARY KEY,
Code VARCHAR(10),
[Name] VARCHAR(200),
[Type] VARCHAR(100),
Active BIT,
CostCenter BIT
)