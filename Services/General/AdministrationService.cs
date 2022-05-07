using Newtonsoft.Json;
using Services.General.Entities.LoginEntities;
using Services.General.Entities.SiigoEntities;
using Services.General.Entities.StoredEntities;
using Services.Secure;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using static Services.General.Enums.Enums;

namespace Services.General
{
    public class AdministrationService
    {
        private ManageExceptions ManageExceptions;
        private string ConnString;
        private string UrlSiigo;

        public AdministrationService()
        {
            ManageExceptions = new ManageExceptions();
            ConnString = ConfigurationManager.ConnectionStrings["ConnString"].ConnectionString;
            UrlSiigo = ConfigurationManager.AppSettings["UrlSiigo"].ToString();
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
        public async Task<LoginEntity> LoginAsync(string login, string password)
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
                            if (dtUser.Rows.Count > 0)
                            {
                                DataRow firstRowUser = dtUser.Rows[0];
                                loginResp = new LoginEntity
                                {
                                    UserId = Convert.ToInt32(firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserId")].ToString()),
                                    UserFirstName = firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserFirstName")].ToString(),
                                    UserLastName = firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserLastName")].ToString(),
                                    UserCompleteName = firstRowUser.ItemArray[dtUser.Columns.IndexOf("UserCompleteName")].ToString(),
                                    usuariosiigo = firstRowUser.ItemArray[dtUser.Columns.IndexOf("usuariosiigo")].ToString(),
                                    accesskey = firstRowUser.ItemArray[dtUser.Columns.IndexOf("accesskey")].ToString(),
                                    access_token = firstRowUser.ItemArray[dtUser.Columns.IndexOf("accesstoken")].ToString(),
                                    daydiff = firstRowUser.ItemArray[dtUser.Columns.IndexOf("daydiff")].ToString()
                                };

                                if (string.IsNullOrEmpty(loginResp.daydiff) || Convert.ToInt32(loginResp.daydiff) > 0)
                                {
                                    await LoginSiigoAsync(loginResp);
                                }
                                await LoadProductsSiigo(loginResp);
                            }
                        }
                    }
                }
            }
            return loginResp;
        }

        private async Task LoginSiigoAsync(LoginEntity loginResp)
        {
            Dictionary<string, string> values = new Dictionary<string, string> { { "username", loginResp.usuariosiigo }, { "access_key", loginResp.accesskey } };
            string url = string.Format("{0}auth", UrlSiigo);
            HttpClient client = new HttpClient();

            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "auth"))
            {
                request.Content = new StringContent(JsonConvert.SerializeObject(values), Encoding.UTF8, "application/json");
                using (HttpContent content = request.Content)
                {
                    HttpResponseMessage response = (await client.PostAsync(url, content));
                    string contents = await response.Content.ReadAsStringAsync();
                    LoginEntity loginEntityFromSiigo = Newtonsoft.Json.JsonConvert.DeserializeObject<LoginEntity>(contents);
                    loginResp.access_token = loginEntityFromSiigo.access_token;
                    loginResp.creationdatetoken = DateTime.Now;
                }
            }

            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "UpdateSessionSiigo",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "accesstoken", Value = loginResp.access_token },
                    new StoredParams {Name = "creationdatetoken", Value = loginResp.creationdatetoken.ToString("yyyy-MM-dd")}
                }
            };
            ExecuteStoredProcedure(StoredObjectParams);
        }

        private async Task LoadProductsSiigo(LoginEntity loginResp)
        {
            string JsonProduct = "";
            string url = string.Format("{0}v1/products", UrlSiigo);
            HttpClient client = new HttpClient();

            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "v1/products"))
            {
                client.DefaultRequestHeaders.Add("Authorization", loginResp.access_token);
                using (HttpContent content = request.Content)
                {
                    HttpResponseMessage response = (await client.GetAsync(url));
                    string contents = await response.Content.ReadAsStringAsync();
                    ResultSiigoEntity objProducts = JsonConvert.DeserializeObject<ResultSiigoEntity>(contents);

                    JsonProduct = JsonConvert.SerializeObject(objProducts.results);
                }
            }

            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "SaveOrUpdateProducts",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "JsonProduct", Value = JsonProduct }
                }
            };
            ExecuteStoredProcedure(StoredObjectParams);
        }
        #endregion
    }
}