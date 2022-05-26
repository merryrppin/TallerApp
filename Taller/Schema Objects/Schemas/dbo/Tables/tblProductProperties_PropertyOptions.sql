CREATE TABLE [dbo].[tblProductProperties_PropertyOptions]
(
	[IdProductPropertiesPropertyOptions] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT(NEWID()),
	[IdProductProperty] UNIQUEIDENTIFIER NOT NULL,
	[IdProductPropertyOption] UNIQUEIDENTIFIER NOT NULL,
	[Order] INT NOT NULL, 
    CONSTRAINT [FK_tblProductProperties_PropertyOptions_tblProductProperties] FOREIGN KEY ([IdProductProperty]) REFERENCES [tblProductProperties]([IdProductProperty]), 
    CONSTRAINT [FK_tblProductProperties_PropertyOptions_tblPropertyOptions] FOREIGN KEY ([IdProductPropertyOption]) REFERENCES [tblProductPropertyOptions]([IdProductPropertyOption])
)
