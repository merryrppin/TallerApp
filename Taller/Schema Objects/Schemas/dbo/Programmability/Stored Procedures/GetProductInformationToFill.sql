CREATE PROCEDURE [dbo].[GetProductInformationToFill] AS
BEGIN
	SELECT ProdType.IdProduct, ProdProp.IdProductProperty, ProdType.HasProperties, ProdType.HasOptions, ProdTypeProp.[Order] AS PropertyOrder, ProdProp.TextProperty, 
		ProdProp.HasOptions AS PropertyHO, ProdProp.HasText AS PropertyHT
	FROM [tblProductPropertyTypes] AS ProdType
		LEFT JOIN [tblProductPropertyType_ProductProperties] AS ProdTypeProp ON ProdType.IdProductPropertyType = ProdTypeProp.IdProductPropertyType
		LEFT JOIN [tblProductProperties] AS ProdProp ON ProdTypeProp.IdProductProperty = ProdProp.IdProductProperty
		ORDER BY ProdType.IdProductPropertyType, ProdTypeProp.[Order]
	
	
	SELECT ProdProp.IdProductProperty, PropOpt.IdProductPropertyOption, ProdPropOpt.[Order] AS OrderOpt, PropOpt.TextOption, PropOpt.HasText AS OptHT
	FROM [tblProductProperties] AS ProdProp
		INNER JOIN [tblProductProperties_PropertyOptions] AS ProdPropOpt ON ProdProp.IdProductProperty = ProdPropOpt.IdProductProperty
		INNER JOIN [tblProductPropertyOptions] AS PropOpt ON ProdPropOpt.IdProductPropertyOption = PropOpt.IdProductPropertyOption
	WHERE ProdProp.HasOptions = 1
	ORDER BY ProdProp.IdProductProperty, ProdPropOpt.[Order]
END
