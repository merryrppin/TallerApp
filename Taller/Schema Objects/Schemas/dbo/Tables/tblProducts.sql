CREATE TABLE [dbo].[tblProducts]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, 
    [code] VARCHAR(20) NOT NULL, 
    [name] VARCHAR(100) NOT NULL, 
    [type] VARCHAR(50) NOT NULL, 
    [stock_control] BIT NOT NULL, 
    [active] BIT NOT NULL,
    [tax_incluided] BIT NOT NULL, 
    [taxes] NVARCHAR(MAX) NULL, 
    [available_quantity] DECIMAL(18, 8) NULL
    
)
