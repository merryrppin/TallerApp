CREATE TABLE [param].[tblGeneralListOption]
(
	[GeneralListOptionId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [GeneralListId] INT NOT NULL, 
    [Name] VARCHAR(100) NOT NULL, 
    [Description] VARCHAR(500) NULL, 
    [Order] INT NOT NULL, 
    [FieldValueTypeId] INT NOT NULL, 
    [TextValue] VARCHAR(MAX) NOT NULL, 
    [NumValue] FLOAT NOT NULL, 
    [LogicValue] BIT NOT NULL, 
    [Active] BIT NOT NULL DEFAULT 1, 
    CONSTRAINT [FK_tblGeneralListOption_tblGeneralList] FOREIGN KEY ([GeneralListId]) REFERENCES [param].[tblGeneralList]([GeneralListId]), 
    CONSTRAINT [FK_tblGeneralListOption_tblFieldValueType] FOREIGN KEY ([FieldValueTypeId]) REFERENCES [param].[tblFieldValueType]([FieldValueTypeId])
)
