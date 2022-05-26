CREATE TABLE [dbo].[tblProductPropertyOptions]
(
	[IdProductPropertyOption] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	[TextOption] VARCHAR(250) NOT NULL,
	[HasText] BIT DEFAULT(0)
)
