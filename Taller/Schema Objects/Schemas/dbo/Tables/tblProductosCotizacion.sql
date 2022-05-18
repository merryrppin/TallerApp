CREATE TABLE [dbo].[tblProductosCotizacion]
(
	[IdProductoCotizacion] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
	[IdCotizacion] UNIQUEIDENTIFIER NOT NULL,
	[IdProducto] UNIQUEIDENTIFIER NOT NULL,
	[DescripcionProducto] VARCHAR(MAX),
	[Cantidad] INT NOT NULL,
	[ValorUnitario] DECIMAL(20,4) NOT NULL,
	[Descuento] DECIMAL(5,2) NOT NULL DEFAULT(0),
	[Tax] DECIMAL(5,2) NOT NULL DEFAULT(0),
	[TaxId] INT,
	[TotalProducto] DECIMAL(20,4) NOT NULL, 
	[DescuentoTotal] DECIMAL(20,4) NOT NULL, 
	[ImpuestoRetencion] DECIMAL(20,4) NOT NULL, 
	[ImpuestoCargo] DECIMAL(20,4) NOT NULL, 
    CONSTRAINT [FK_tblProductosCotizacion_tblCotizaciones] FOREIGN KEY ([IdCotizacion]) REFERENCES [tblCotizaciones]([IdCotizacion]), 
    CONSTRAINT [FK_tblProductosCotizacion_tblProducts] FOREIGN KEY ([IdProducto]) REFERENCES [tblProducts]([id])
)
