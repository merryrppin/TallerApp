CREATE PROCEDURE [dbo].[SaveOrUpdateWareHouse]
	@JsonWarehouses NVARCHAR(MAX)
AS
	SELECT id,[name],active,HasMovements
	INTO #tmpWareHouses
	FROM OPENJSON(@JsonWarehouses)
	WITH (id INT '$.id',[name] VARCHAR(500) '$.name',HasMovements BIT '$.has_movements',active BIT '$.active')

	MERGE tblWareHouses AS tblW
	USING (SELECT * FROM #tmpWareHouses) AS SOURCE
	ON tblW.id = SOURCE.id
	WHEN MATCHED THEN
		UPDATE SET 	[name] = SOURCE.[name] ,
					active = SOURCE.active,
					[HasMovements] = SOURCE.[HasMovements] 
	WHEN NOT MATCHED THEN 
		INSERT (id,[name], active, HasMovements)
		VALUES (SOURCE.id, SOURCE.[name], SOURCE.active, SOURCE.[HasMovements]);
GO