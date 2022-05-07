--[erp].[param].[tblMenu]
SET IDENTITY_INSERT [erp].[param].[tblMenu] ON

INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(1,'Configuración','','flaticon2-gear',NULL,100,1,'',0);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(2,'Usuarios','','',1,100,1,'',1);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(3,'Listar Usuarios','','',2,100,1,'#!/listUsers',2);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(4,'Permisos Usuarios','','',2,200,1,'#!/permissionsUsers',2);

INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(5,'Administración','','flaticon2-gear',NULL,200,1,'',0);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(6,'Bodegas','','',5,100,1,'',1);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(7,'Listar Bodegas','','',6,100,1,'#!/listWarehouse',2);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(10,'Series','','',5,100,1,'',1);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(11,'Listar Series','','',10,100,1,'#!/listSeries',2);

INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(8,'Ventas','','flaticon2-shopping-cart-1',NULL,200,1,'',0);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(9,'Factura Ventas','','',8,100,1,'#!/addSaleInvoice',1);
INSERT INTO [erp].[param].[tblMenu]([MenuId],[Name],[Description],[Icon],[ParentMenuId],[Order],[Active],[Url],[Level]) VALUES(12,'Lista de precios','','',8,200,1,'#!/priceList',1);

SET IDENTITY_INSERT [erp].[param].[tblMenu] OFF

--[erp].[dbo].[tblUser]
INSERT INTO [erp].[dbo].[tblUsers](UserFirstName, UserLastName, UserEmail, Login, Password) VALUES('Wilmar', 'González', 'wilmar.gonzalez.franco@hotmail.com', 'wgonzalez', 'd2dvbnphbGV6');