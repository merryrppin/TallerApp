CREATE PROCEDURE [dbo].[GetActiveMenus] AS
BEGIN
	SELECT [MenuId], [Name], [Description], [Icon], [ParentMenuId], [Order], [Active], [Url], [Level] 
	FROM [param].[tblMenu] 
	WHERE [Active] = 1 
	ORDER BY [Level] DESC;
END