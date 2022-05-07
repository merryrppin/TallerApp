CREATE TABLE [param].[tblFieldValueType]
(
	[FieldValueTypeId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [TextValue] VARCHAR(100) NOT NULL, 
    [Description] VARCHAR(500) NULL, 
    [Active] BIT NOT NULL DEFAULT 1
)
