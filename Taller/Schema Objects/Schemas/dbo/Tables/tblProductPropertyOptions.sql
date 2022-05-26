CREATE TABLE [dbo].[tblProductPropertyOptions]
(
	[IdProductPropertyOption] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	[IdProductProperty] UNIQUEIDENTIFIER NOT NULL,
	[TextOption] VARCHAR(250) NOT NULL,
	[Order] INT NOT NULL,
	[HasText] BIT DEFAULT(0)
)
