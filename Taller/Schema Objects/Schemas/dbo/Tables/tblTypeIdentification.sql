﻿CREATE TABLE [dbo].[tblTypeIdentification]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(), 
    [code] VARCHAR(10) NOT NULL, 
    [name] VARCHAR(200) NOT NULL
)
