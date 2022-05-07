CREATE TABLE [param].[tblMenu]
(
	[MenuId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(100) NOT NULL, 
    [Description] VARCHAR(500) NULL, 
    [Icon] VARCHAR(100) NULL, 
    [Url] VARCHAR(300) NULL, 
    [ParentMenuId] INT NULL, 
    [Order] INT NOT NULL DEFAULT 0, 
    [Level] INT NOT NULL, 
    [Active] BIT NOT NULL DEFAULT 1
)
