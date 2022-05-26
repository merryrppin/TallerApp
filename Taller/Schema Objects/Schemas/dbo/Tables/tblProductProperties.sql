CREATE TABLE [dbo].[tblProductProperties]
(
	[IdProductProperty] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	[IdProductPropertyType] UNIQUEIDENTIFIER NOT NULL,
	[TextProperty] VARCHAR(250) NOT NULL,
	[HasOptions] BIT DEFAULT(0),
	[HasText] BIT DEFAULT(0)
)
