CREATE TABLE [param].[tblGeneralList]
(
	[GeneralListId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [ListName] VARCHAR(100) NOT NULL, 
    [Description] VARCHAR(500) NOT NULL, 
    [FieldValueTypeId] INT NOT NULL, 
    [Active] BIT NOT NULL DEFAULT 1, 
    CONSTRAINT [FK_tblGeneralList_tblFieldValueType] FOREIGN KEY ([FieldValueTypeId]) REFERENCES [param].[tblFieldValueType]([FieldValueTypeId])
)
