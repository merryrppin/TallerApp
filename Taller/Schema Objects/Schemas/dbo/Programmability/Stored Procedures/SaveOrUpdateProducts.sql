﻿CREATE PROCEDURE [dbo].[SaveOrUpdateProducts]
	@JsonProduct NVARCHAR(MAX)
AS

	SELECT id,code,[name],[type],stock_control,active,tax_included,taxes,available_quantity
	INTO #tmpProducts
	FROM OPENJSON(@JsonProduct)
	WITH ( id UNIQUEIDENTIFIER '$.id',
	code VARCHAR(20) '$.code',
	[name] VARCHAR(100),
	[type] VARCHAR(50),
	stock_control BIT '$.stock_control',
	active BIT '$.active',
	tax_included BIT '$.tax_included',
	taxes NVARCHAR(MAX) AS JSON,
	available_quantity DECIMAL(18,8) '$.available_quantity')

	MERGE tblProducts AS tblP
	USING (SELECT * FROM #tmpProducts) AS SOURCE
	ON tblP.id = SOURCE.id
	WHEN MATCHED THEN
		UPDATE SET 	code = SOURCE.code ,
					[name] = SOURCE.[name] ,
					[type] = SOURCE.[type] ,
					stock_control = SOURCE.stock_control,
					active = SOURCE.active ,
					tax_included = SOURCE.tax_included ,
					taxes = SOURCE.taxes,
					available_quantity = SOURCE.available_quantity
	WHEN NOT MATCHED THEN 
		INSERT (id ,code ,[name] ,[type] ,stock_control, active ,tax_included ,taxes ,available_quantity)
		VALUES (SOURCE.id ,SOURCE.code ,SOURCE.[name] ,SOURCE.[type] ,SOURCE.stock_control ,SOURCE.active ,SOURCE.tax_included ,SOURCE.taxes ,SOURCE.available_quantity);


GO
