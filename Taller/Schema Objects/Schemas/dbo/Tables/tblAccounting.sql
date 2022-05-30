CREATE TABLE [dbo].[tblAccounting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [document] NVARCHAR(MAX) NOT NULL, 
    [date] VARCHAR(10) NOT NULL, 
    [items] NVARCHAR(MAX) NOT NULL, 
    [observations] VARCHAR(500) NULL
)
