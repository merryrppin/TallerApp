CREATE TABLE [dbo].[tblProductosRecepcionProducto]
(
	[IdProductoRecepcionProducto] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
	[IdRecepcionProducto] INT NOT NULL,
	[IdProducto] UNIQUEIDENTIFIER NOT NULL,
	[DescripcionProducto] VARCHAR(MAX),
	[Cantidad] INT NOT NULL,
	
    CONSTRAINT [FK_tblProductosRecepcionProducto_tblCotizaciones] FOREIGN KEY ([IdRecepcionProducto]) REFERENCES [tblRecepcionProducto]([IdRecepcionProducto]), 
    CONSTRAINT [FK_tblProductosRecepcionProducto_tblProducts] FOREIGN KEY ([IdProducto]) REFERENCES [tblProducts]([id])
)
