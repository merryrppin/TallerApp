CREATE TABLE tblReceiptDetail
(
ReceiptDetailId INT IDENTITY PRIMARY KEY,
ReceiptId UNIQUEIDENTIFIER,
QuotationId INT,
ProductQuotationId UNIQUEIDENTIFIER,
OriginalQuantity INT,
QuantityPending INT,
UnitValue DECIMAL(20,4) NOT NULL,
TotalValue DECIMAL(20,4) NOT NULL, 
TotalDiscount DECIMAL(20,4) NOT NULL,
CONSTRAINT [FK_tblReceiptDetail_tblReceipt] FOREIGN KEY ([ReceiptId]) REFERENCES [tblReceipt]([ReceiptId]), 
CONSTRAINT [FK_tblReceiptDetail_tblCotizaciones] FOREIGN KEY ([QuotationId]) REFERENCES [tblCotizaciones]([IdCotizacion]), 
CONSTRAINT [FK_tblReceiptDetail_tblProductosCotizacion] FOREIGN KEY ([ProductQuotationId]) REFERENCES [tblProductosCotizacion]([IdProductoCotizacion])
)