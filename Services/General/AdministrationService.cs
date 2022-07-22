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
using System.Net.Http;
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
        private bool syncInfoSiigo;

        public AdministrationService()
        {
            ManageExceptions = new ManageExceptions();
            ConnString = ConfigurationManager.ConnectionStrings["ConnString"].ConnectionString;
            UrlSiigo = ConfigurationManager.AppSettings["UrlSiigo"].ToString();
            syncInfoSiigo = Convert.ToBoolean(ConfigurationManager.AppSettings["SyncInfoSiigo"].ToString());
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
            try
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
                                    if (syncInfoSiigo)
                                    {
                                        await LoadProductsSiigo(loginResp);
                                        await LoadCustomersSiigo(loginResp);
                                        await LoadWareHouses(loginResp);
                                        await LoadAccountingReceiptTypes(loginResp);
                                    }
                                }
                            }
                        }
                    }
                }
                return loginResp;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public string EncryptString(LoginEntity LoginEntity)
        {
            return Encode_Decode.Encrypt(LoginEntity.password);
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
            StoredObjectResponse StoredObjectResponse = ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
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

            StoredObjectResponse StoredObjectResponse = ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
        }
        private async Task LoadCustomersSiigo(LoginEntity loginResp)
        {
            int currentPage = 1;
            int pageSize = 100;
            int currentSize = 100;
            int totalResults = 0;
            string JsonCustomers = "";
            string originalUrl = "{0}v1/customers?page={1}&page_size={2}";

            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", loginResp.access_token);

            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "v1/customers"))
            {
                do
                {
                    string url = string.Format(originalUrl, UrlSiigo, currentPage.ToString(), pageSize.ToString());
                    using (HttpContent content = request.Content)
                    {
                        HttpResponseMessage response = (await client.GetAsync(url));
                        string contents = await response.Content.ReadAsStringAsync();
                        ResultSiigoEntity objCustomers = JsonConvert.DeserializeObject<ResultSiigoEntity>(contents);

                        JsonCustomers = JsonConvert.SerializeObject(objCustomers.results);
                        if (currentPage == 1)
                            totalResults = objCustomers.pagination.total_results;

                    }
                    currentPage++;
                    currentSize += pageSize;
                    SaveOrUpdateCustomers(JsonCustomers);
                } while (currentSize < totalResults);


            }
        }

        private void SaveOrUpdateCustomers(string JsonCustomers)
        {
            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "SaveOrUpdateCustomers",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "JsonCustomers", Value = JsonCustomers }
                }
            };

            StoredObjectResponse StoredObjectResponse = ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
        }

        public async Task<string> GetNumberCC(LoginEntity loginResp)
        {
            string JsonProduct = "";
            string url = string.Format("{0}v1/document-types?type=CC", UrlSiigo);
            HttpClient client = new HttpClient();

            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "v1/document-types?type=CC"))
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
            return JsonProduct;



        }

        public async Task GetNumberCC1(LoginEntity loginResp)
        {
            string JsonProduct = "";
            string url = string.Format("{0}v1/document-types?type=CC", UrlSiigo);
            HttpClient client = new HttpClient();

            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "v1/document-types?type=CC"))
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

        }

        public async Task<string> CreateCustomer(LoginEntity loginResp)
        {
            string url = string.Format("{0}v1/customers", UrlSiigo);
            string contents = String.Empty;
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", loginResp.access_token);
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "{0}v1/customers"))
            {
                request.Content = new StringContent(loginResp.Customers, Encoding.UTF8, "application/json");
                using (HttpContent content = request.Content)
                {
                    HttpResponseMessage response = (await client.PostAsync(url, content));
                    contents = await response.Content.ReadAsStringAsync();
                    if (!contents.Contains("error"))
                    {
                        SaveOrUpdateCustomers(contents);
                    }

                }
            }

            return contents;

        }

        public async Task LoadWareHouses(LoginEntity loginResp)
        {
            string jsonWarehouses = "";
            string url = string.Format("{0}v1/warehouses", UrlSiigo);
            HttpClient client = new HttpClient();
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "v1/warehouses"))
            {
                client.DefaultRequestHeaders.Add("Authorization", loginResp.access_token);
                using (HttpContent content = request.Content)
                {
                    HttpResponseMessage response = (await client.GetAsync(url));
                    jsonWarehouses = await response.Content.ReadAsStringAsync();
                }
            }

            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "SaveOrUpdateWareHouse",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "JsonWarehouses", Value = jsonWarehouses }
                }
            };

            StoredObjectResponse StoredObjectResponse = ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
        }

        public async Task<string> CreateReceipt(LoginEntity loginResp)
        {
            string url = string.Format("{0}/v1/journals", UrlSiigo);
            HttpClient client = new HttpClient();
            string contents = string.Empty;
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "/v1/journals"))
            {
                request.Content = new StringContent(loginResp.Receipt, Encoding.UTF8, "application/json");
                client.DefaultRequestHeaders.Add("Authorization", loginResp.access_token);
                using (HttpContent content = request.Content)
                {
                    HttpResponseMessage response = (await client.PostAsync(url, content));
                    contents = await response.Content.ReadAsStringAsync();

                }
            }
            return contents;
        }

        public async Task LoadAccountingReceiptTypes(LoginEntity loginResp)
        {
            string accountingReceiptTypes = "";
            string url = string.Format("{0}v1/document-types?type=CC", UrlSiigo);
            HttpClient client = new HttpClient();
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, "v1/document-types?type=CC"))
            {
                client.DefaultRequestHeaders.Add("Authorization", loginResp.access_token);
                using (HttpContent content = request.Content)
                {
                    HttpResponseMessage response = (await client.GetAsync(url));
                    accountingReceiptTypes = await response.Content.ReadAsStringAsync();
                }
            }

            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "SaveOrUpdateAccountingReceiptTypes",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "JsonAccountingReceiptTypes", Value = accountingReceiptTypes }
                }
            };

            StoredObjectResponse StoredObjectResponse = ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
        }

        #endregion
    }
}