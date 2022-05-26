CREATE TABLE [dbo].[tblProductPropertyType_ProductProperties]
(
	[IdProductPropertyTypeProductProperties] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT(NEWID()),
	[IdProductPropertyType] UNIQUEIDENTIFIER NOT NULL,
	[IdProductProperty] UNIQUEIDENTIFIER NOT NULL,
	[Order] INT NOT NULL, 
    CONSTRAINT [FK_tblProductPropertyType_ProductProperties_tblProductPropertyTypes] FOREIGN KEY ([IdProductPropertyType]) REFERENCES [tblProductPropertyTypes]([IdProductPropertyType]), 
    CONSTRAINT [FK_tblProductPropertyType_ProductProperties_tblProductProperties] FOREIGN KEY ([IdProductProperty]) REFERENCES [tblProductProperties]([IdProductProperty])
)
