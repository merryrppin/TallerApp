CREATE PROCEDURE [dbo].[SaveOrUpdateProducts]
	@JsonProduct NVARCHAR(MAX)
AS

	SELECT id,code,[name],[type],stock_control,active,tax_incluided,taxes,available_quantity
	INTO #tmpProducts
	FROM OPENJSON(@JsonProduct)
	WITH ( id uniqueidentifier '$.id',
	code VARCHAR(20) '$.code',
	[name] VARCHAR(100),
	[type] varchar(50),
	stock_control bit '$.stock_control',
	active bit '$.active',
	tax_incluided bit '$.tax_included',
	taxes NVARCHAR(MAX) '$.taxes',
	available_quantity decimal(18,8) '$.available_quantity')

	MERGE tblProducts AS tblP
	USING (SELECT * FROM #tmpProducts) AS SOURCE
	ON tblP.id = SOURCE.id
	WHEN MATCHED THEN
		UPDATE SET 	code = SOURCE.code ,
					[name] = SOURCE.[name] ,
					[type] = SOURCE.[type] ,
					stock_control = SOURCE.stock_control,
					active = SOURCE.active ,
					tax_incluided = SOURCE.tax_incluided ,
					taxes = SOURCE.taxes,
					available_quantity = SOURCE.available_quantity
	WHEN NOT MATCHED THEN 
		INSERT (id ,code ,[name] ,[type] ,stock_control, active ,tax_incluided ,taxes ,available_quantity)
		VALUES (SOURCE.id ,SOURCE.code ,SOURCE.[name] ,SOURCE.[type] ,SOURCE.stock_control ,SOURCE.active ,SOURCE.tax_incluided ,SOURCE.taxes ,SOURCE.available_quantity);


GO
