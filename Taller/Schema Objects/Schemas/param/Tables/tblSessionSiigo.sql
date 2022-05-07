CREATE TABLE [param].[tblSessionSiigo]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	[usuario] VARCHAR(250) NOT NULL,
	[accesskey] VARCHAR(150) NOT NULL,
	[accesstoken] VARCHAR(MAX),
	[creationdatetoken] DATETIME,
	[expirationdatetoken] DATETIME
)
