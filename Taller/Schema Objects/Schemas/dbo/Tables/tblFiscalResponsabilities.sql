﻿CREATE TABLE [dbo].[tblFiscalResponsabilities]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(), 
    [code] VARCHAR(7) NOT NULL, 
    [name] VARCHAR(200) NOT NULL
)
