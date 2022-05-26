CREATE TABLE [dbo].[tblProductPropertyTypes]
(
	[IdProductPropertyType] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	[IdProduct] UNIQUEIDENTIFIER,
	[HasProperties] BIT DEFAULT(0),
	[HasOptions] BIT DEFAULT(0)
)
