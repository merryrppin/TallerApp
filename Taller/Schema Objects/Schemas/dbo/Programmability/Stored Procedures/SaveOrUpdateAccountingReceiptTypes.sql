CREATE PROCEDURE [dbo].[SaveOrUpdateAccountingReceiptTypes]
	@JsonAccountingReceiptTypes NVARCHAR(MAX)
AS
	SELECT id, code, [name], [type], active, CostCenter
	INTO #tmpAccountingReceiptTypes
	FROM OPENJSON(@JsonAccountingReceiptTypes)
	WITH (id INT '$.id',[code] VARCHAR(500) '$.code', [name] VARCHAR(100) '$.name', [type] VARCHAR(100) '$.name', active BIT '$.active', CostCenter BIT '$.cost_center')

	MERGE tblAccountingReceiptTypes AS tblR
	USING (SELECT * FROM #tmpAccountingReceiptTypes) AS SOURCE
	ON tblR.id = SOURCE.id
	WHEN MATCHED THEN
		UPDATE SET 	[Name] = SOURCE.[name] ,
					Active = SOURCE.active,
					[Code] = SOURCE.[code],
					[CostCenter] = SOURCE.[CostCenter] 
	WHEN NOT MATCHED THEN 
		INSERT (Id,	Code, Name, [Type], Active, CostCenter)
		VALUES (SOURCE.id, SOURCE.[code], SOURCE.[name], SOURCE.[type], SOURCE.active, SOURCE.[CostCenter]);
GO