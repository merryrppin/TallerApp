using Services.General.Entities.LoginEntities;
using Services.General.Entities.StoredEntities;
using Services.Secure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using static Services.General.Enums.Enums;

namespace Services.General
{
    public class AdministrationService
    {
        private ManageExceptions ManageExceptions;
        private string ConnString;

        public AdministrationService()
        {
            ManageExceptions = new ManageExceptions();
            ConnString = ConfigurationManager.ConnectionStrings["ConnString"].ConnectionString;
        }

        #region Stored Procedure
        public StoredObjectResponse ExecuteStoredProcedure(StoredObjectParams StoredObjectParams)
        {
            StoredObjectResponse StoredObjectResponse = new StoredObjectResponse();
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(ConnString))
            {
                using (SqlCommand cmd = new SqlCommand(StoredObjectParams.StoredProcedureName, con))
                {
                    try
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        foreach (StoredParams StoredParam in StoredObjectParams.StoredParams)
                        {
                            cmd.Parameters.Add("@" + StoredParam.Name, TypeOfParameter(StoredParam.TypeOfParameter)).Value = StoredParam.Value;
                        }
                        con.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        adapter.Fill(ds);
                        StoredObjectResponse.Value = new List<StoredTableResponse>();
                        foreach (DataTable dataTable in ds.Tables)
                        {
                            List<string> columns = new List<string>();
                            foreach (DataColumn column in dataTable.Columns)
                            {
                                columns.Add(column.ColumnName);
                            }
                            List<List<string>> rows = new List<List<string>>();
                            foreach (DataRow rowsT in dataTable.Rows)
                            {
                                List<string> row = (rowsT.ItemArray as object[]).ToList().ConvertAll(input => input.ToString());
                                rows.Add(row);
                            }
                            StoredObjectResponse.Value.Add(new StoredTableResponse { TableName = dataTable.TableName, Columns = columns, Rows = rows });
                        }
                    }
                    catch (Exception ex)
                    {
                        StoredObjectResponse.Exception = ex;
                    }
                    finally
                    {
                        con.Dispose();
                        cmd.Dispose();
                    }
                }
            }
            return StoredObjectResponse;
        }

        private SqlDbType TypeOfParameter(int TypeOfParameter)
        {
            switch (TypeOfParameter)
            {
                case (int)EnumTypeOfParameter.StringType:
                    return SqlDbType.VarChar;
                case (int)EnumTypeOfParameter.IntType:
                    return SqlDbType.Int;
                case (int)EnumTypeOfParameter.BoolType:
                    return SqlDbType.Bit;
                case (int)EnumTypeOfParameter.DateType:
                    return SqlDbType.Date;
                default:
                    return SqlDbType.VarChar;
            }
        }
        #endregion
        #region User
        public LoginEntity Login(string login, string password)
        {
            LoginEntity loginResp = new LoginEntity();
            string passwordEncrypted = Encode_Decode.Encrypt(password);

            using (SqlConnection con = new SqlConnection(ConnString))
            {
                using (SqlCommand cmd = new SqlCommand("GetLoginData", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@login", SqlDbType.VarChar).Value = login;
                    cmd.Parameters.Add("@password", SqlDbType.VarChar).Value = passwordEncrypted;
                    using (SqlDataAdapter sda = new SqlDataAdapter())
                    {
                        cmd.Connection = con;
                        sda.SelectCommand = cmd;
                        using (DataSet ds = new DataSet())
                        {
                            sda.Fill(ds);
                            DataTable dtUser = ds.Tables[0];
                            DataTable dtCompany = ds.Tables[1];
                            if (dtUser.Rows.Count > 0)
                            {
                                DataRow firstRowUser = dtUser.Rows[0];
                                DataRow firstRowCompany = dtCompany.Rows[0];
                                loginResp = new LoginEntity
                                {
                                    UserId = Convert.ToInt32(firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserId")].ToString()),
                                    UserFirstName = firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserFirstName")].ToString(),
                                    UserLastName = firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserLastName")].ToString(),
                                    UserCompleteName = firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserCompleteName")].ToString(),                                    
                                    //Info tblCompanies
                                    CompanyId = Convert.ToInt32(firstRowCompany.ItemArray[dtCompany.Columns.IndexOf("CompanyId")].ToString()),
                                    CompanyName = firstRowCompany.ItemArray[dtCompany.Columns.IndexOf("CompanyName")].ToString(),
                                    Country = firstRowCompany.ItemArray[dtCompany.Columns.IndexOf("Country")].ToString(),
                                    NIT = firstRowCompany.ItemArray[dtCompany.Columns.IndexOf("NIT")].ToString(),
                                };
                            }
                        }
                    }
                }
            }
            return loginResp;
        }

        /// <summary>
        /// Este metodo devuelve todos los usuarios activos
        /// </summary>
        /// <returns></returns>
        #endregion
    }
}