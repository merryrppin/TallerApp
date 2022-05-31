CREATE TABLE [dbo].[tblProductosRecepcionProductoValues]
(
	[IdProductosRecepcionProductoValues] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
	[IdProductoRecepcionProducto] UNIQUEIDENTIFIER NOT NULL,
	[IdProductProperty] UNIQUEIDENTIFIER NOT NULL,
	[ValueOption] VARCHAR(MAX), 
    CONSTRAINT [FK_tblProductosRecepcionProductoValues_tblProductosRecepcionProducto] FOREIGN KEY ([IdProductoRecepcionProducto]) REFERENCES [tblProductosRecepcionProducto]([IdProductoRecepcionProducto]),
    CONSTRAINT [FK_tblProductosRecepcionProductoValues_tblProductProperties] FOREIGN KEY ([IdProductProperty]) REFERENCES [tblProductProperties]([IdProductProperty]), 
)
