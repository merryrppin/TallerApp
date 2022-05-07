CREATE TABLE [dbo].[tblCustomers]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [type] VARCHAR(50) NOT NULL, 
    [person_type] VARCHAR(50) NOT NULL, 
    [id_type] NVARCHAR(MAX) NOT NULL, 
    [identification] BIGINT NOT NULL, 
    [branch_office] INT NOT NULL, 
    [check_digit] INT NOT NULL, 
    [name] NVARCHAR(MAX) NOT NULL, 
    [comercial_name] VARCHAR(100) NULL, 
    [active] BIT NOT NULL, 
    [vat_responsible] BIT NOT NULL, 
    [fiscal_responsibilities] NVARCHAR(MAX) NULL, 
    [address] NVARCHAR(MAX) NULL, 
    [phones] NVARCHAR(MAX) NULL, 
    [contacts] NVARCHAR(MAX) NULL, 
    [comments] VARCHAR(500) NULL
)
