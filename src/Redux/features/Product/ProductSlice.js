import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ALL_PRODUCTS_LIST_WITH_VARIANTS,
  BASE_URL,
  PRODUCTS_LIST,
  UPDATE_TYPE,
} from "../../../Constants/Config";

const initialState = {
  loading: false,
  productsData: [],
  allProductsData: [],
  page: 0,
  offset: 0,
  limit: 10,
  hasMore: true,
  successMessage: "",
  error: "",
  formData: [],

  // for add product varient
  isLoading: false,
  isError: false,
  // for edit product
  isEditError: false,
  // for fetchDataBy Id
  isFetchLoading: false,

  // showType initial state
  showType: 3,

  varientProduct: [],
  fetchProductLoadingDropdown: false,
  fetchCategoryListLoading: false,
  fetchTaxListLoading: false,
};
let cancelTokenSource;
let activeRequests = 0;

// Generate pening , fulfilled and rejected action type
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (data) => {
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(
        BASE_URL + ALL_PRODUCTS_LIST_WITH_VARIANTS,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data.result;
      }
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// Generate pening , fulfilled and rejected action type
export const fetchProductsData = createAsyncThunk(
  "products/fetchProductsData",
  async (data, { rejectWithValue }) => {
    // Cancel the previous request if it exists
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Previous request canceled");
    }

    // Create a new cancel token
    cancelTokenSource = axios.CancelToken.source();
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(BASE_URL + PRODUCTS_LIST, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        cancelToken: cancelTokenSource.token,
      });
      // console.log("api products: ", response.data);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      // throw new Error("Internal Server Error");
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        const customError = {
          message: error.message,
          status: error.response ? error.response.status : "Network Error",
          data: error.response ? error.response.data : null,
        };
        return rejectWithValue(customError);
      }
    }
  }
);

export const updateProductsType = createAsyncThunk(
  "products/updateProductsType",
  async (data, { rejectWithValue }) => {
    const { token, ...dataNew } = data;
    try {
      const response = await axios.post(BASE_URL + UPDATE_TYPE, dataNew, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);
export const getInventorySetting = createAsyncThunk(
  "products/getInventorySetting",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Profile_setup/inventory_register_setting",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response?.data?.result?.cost_per;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const getInventorySettingOnVarient = createAsyncThunk(
  "products/getInventorySettingOnVarient",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Profile_setup/inventory_register_setting",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const editProductData = createAsyncThunk(
  "products/editProduct",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/edit_produt",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.log("error api", error);
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/add_product",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

// dropdown content
export const fetchVarientList = createAsyncThunk(
  "products/fetchVarientList",
  async (payload, { rejectWithValue }) => {
    const { token, ...newData } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Varient_react_api/varients_list",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const fetchCategoryList = createAsyncThunk(
  "products/fetchCategoryList",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Categoryapi/category_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const fetchTaxList = createAsyncThunk(
  "products/fetchTaxList",
  async (payload) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Settingapi/tax_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchProductList = createAsyncThunk(
  "products/fetchProductList",
  async (payload) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/products_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchProductsDataById = createAsyncThunk(
  "products/fetchProductData",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/get_productdata_ById",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      //  catch (error) {
      //   throw new Error(error.response.data.message);
      // }
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const checkProductTitle = createAsyncThunk(
  "products/checkProductTitle",
  async (payload) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_productTitle",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchVendorList = createAsyncThunk(
  "products/fetchVendorList",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/product_vendors_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const filterVendorAPI = createAsyncThunk(
  "products/filterVendorAPI",
  async (payload) => {
    try {
      const response = await axios.post(
        BASE_URL + "Vendor_api/vendor_list",
        payload
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const assignProductVendor = createAsyncThunk(
  "products/assignProductVendor",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/assign_product_vendors",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const fetchSalesHistory = createAsyncThunk(
  "products/fetchSalesHistory",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/saleshistory",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const assignPrefferedVendor = createAsyncThunk(
  "products/assignPrefferedVendor",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/assign_preferred_vendor",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const deleteProductVendor = createAsyncThunk(
  "products/deleteProductVendor",
  async (payload) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Productapi/delete_product_vendor",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const saveVendorList = createAsyncThunk(
  "products/saveVendorList",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Productapi/save_vendor_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const getAlreadyAssignVendor = createAsyncThunk(
  "products/getAlreadyAssignVendor",
  async (payload) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/assign_product_vendors_list",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const bulkVendorAssign = createAsyncThunk(
  "products/bulkVendorAssign",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/bulk_assign_vendors",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const saveSingleVarientPO = createAsyncThunk(
  "products/saveSingleVarientPO",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/save_instant_po",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const saveBulkInstantPo = createAsyncThunk(
  "products/saveBulkInstantPo",
  async (payload) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/bulk_instant_po",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const changeOnlineOrderMethod = createAsyncThunk(
  "products/changeOnlineOrderMethod",
  async (payload) => {
    const { token, ...payloadNew } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/product_show_status_update",
        payloadNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const changeShowStatusProduct = createAsyncThunk(
  "products/changeShowStatusProduct",
  async (payload) => {
    const { token, ...payloadNew } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/update_show_status",
        payloadNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const deleteProductAPI = createAsyncThunk(
  "products/deleteProductAPI",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/delete_product",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const checkUpcCodeMultiple = createAsyncThunk(
  "products/checkUpcCodeMultiple",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    const { token, ...data } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_upc",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const checkUpcCodeSingle = createAsyncThunk(
  "products/checkUpcCodeSingle",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    const { token, ...data } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_upc_form",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const checkUpcOnVarientEdit = createAsyncThunk(
  "products/checkUpcOnVarientEdit",
  async (payload) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    const { token, ...newData } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/check_upc_new",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const updateEditVarient = createAsyncThunk(
  "products/updateEditVarient",
  async (payload, { rejectWithValue }) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    const { token, ...newData } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/update_variant",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const fetchVarietDataById = createAsyncThunk(
  "products/fetchVarietDataById",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/get_variantdata_ById",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const fetchTags = createAsyncThunk(
  "products/fetchTags",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/list_brand_tag",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const fetchBrands = createAsyncThunk(
  "products/fetchBrands",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");

    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/list_brand_tag",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const updateVariantMerging = createAsyncThunk(
  "products/updateVariantMerging",
  async (payload, { rejectWithValue }) => {
    // const token = payload.get('token'); // Extract the token from FormData
    // payload.delete('token');
    const { token, ...newData } = payload;
    try {
      const response = await axios.post(
        BASE_URL + "/api/Product_merge/merge",
        newData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

export const deleteMultipleProductAPI = createAsyncThunk(
  "products/deleteMultipleProductAPI",
  async (payload, { rejectWithValue }) => {
    const token = payload.get("token"); // Extract the token from FormData
    payload.delete("token");
    try {
      const response = await axios.post(
        BASE_URL + "Product_api_react/delete_multiple_products",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (error) {
      // throw new Error("Internal Server Error");
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    emptyProduct: (state, action) => {
      // console.log("empty action payload: ", action.payload);
      state.productsData = action.payload;
      state.offset = 0;
      state.limit = 10;
      state.hasMore = true;
      state.page = 0;
    },
    editProduct: (state, action) => {
      state.productsData = state.productsData.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product, // Spread syntax to copy existing properties
            title: action.payload.title, // Update the title
            old_title: action.payload.title,
          };
        } else {
          // This isn't the one we're looking for - leave it as is
          return product;
        }
      });
    },
    updateFormValue: (state, action) => {
      state.formData = action?.payload;
    },
    changeShowType: (state, action) => {
      const { id, updateValue } = action.payload;
      const obj = state.productsData?.find((obj) => obj.id === id);
      if (obj) {
        obj.show_type = updateValue;
      }
    },
    changeShowStatus: (state, action) => {
      const { id, showStatus } = action.payload;
      const obj = state.productsData?.find((obj) => obj.id === id);
      if (obj) {
        obj.show_status = showStatus;
      }
    },
    setVarientList: (state, action) => {
      state.varientProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.allProductsData = action.payload;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.allProductsData = [];
    });

    builder.addCase(fetchProductsData.pending, (state) => {
      activeRequests++;
      state.loading = true;
    });
    builder.addCase(fetchProductsData.fulfilled, (state, action) => {
      activeRequests--;
      if (activeRequests === 0) {
        state.loading = false;
      }

      // state.productsData = action.payload;
      // state.productsData = [...state.productsData, ...action.payload];
      // Ensure productsData is always treated as an array
      if (!Array.isArray(state.productsData)) {
        state.productsData = [];
      }
      // Append new items to the productsData array
      // console.log(state);
      const productIds = new Set(
        state.productsData.map((product) => product.title)
      );

      // console.log("action.payload: ", action.payload);
      // console.log("product ids: ", productIds);

      // Append new items to the productsData array if they are not already present
      action?.payload?.forEach((product) => {
        if (!productIds.has(product.title)) {
          state.productsData.push(product);
          productIds.add(product.title);
        }
      });
      // JSON.parse(localStorage.getItem("product-focus-data")) &&
      // JSON.parse(localStorage.getItem("product-focus-data"))?.offset
      //   ? (state.offset =
      //       JSON.parse(localStorage.getItem("product-focus-data"))?.offset + 10)
      //   : (state.offset += 10);
      state.offset += 10;
      state.hasMore = action?.payload?.length > 0;
      state.error = "";
    });
    builder.addCase(fetchProductsData.rejected, (state, action) => {
      activeRequests--;
      if (activeRequests === 0) {
        state.loading = false;
        state.productsData = [];
        state.error = action.error.message;
      }
    });
    builder.addCase(updateProductsType.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductsType.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateProductsType.rejected, (state, action) => {
      state.loading = false;
      state.productsData = {};
      state.error = action.error.message;
    });

    // add product varient
    builder.addCase(addProduct.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
    });

    // edit product
    builder.addCase(editProductData.pending, (state) => {
      state.isLoading = true;
      state.isEditError = false;
    });
    builder.addCase(editProductData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isEditError = false;
    });
    builder.addCase(editProductData.rejected, (state, action) => {
      state.isLoading = false;
      state.isEditError = true;
    });

    // fetchingDataById
    builder.addCase(fetchProductsDataById.pending, (state) => {
      state.isFetchLoading = true;
      // state.isEditError = false;
    });
    builder.addCase(fetchProductsDataById.fulfilled, (state, action) => {
      state.isFetchLoading = false;
      // state.isEditError = false;
    });
    builder.addCase(fetchProductsDataById.rejected, (state, action) => {
      state.isFetchLoading = false;
      // state.isEditError = true;
    });

    // product fetch listing in dropdown
    builder.addCase(fetchProductList.pending, (state) => {
      state.fetchProductLoadingDropdown = true;
      // state.isEditError = false;
    });
    builder.addCase(fetchProductList.fulfilled, (state, action) => {
      state.fetchProductLoadingDropdown = false;
      // state.isEditError = false;
    });
    builder.addCase(fetchProductList.rejected, (state, action) => {
      state.fetchProductLoadingDropdown = false;
      // state.isEditError = true;
    });

    // fetchCategoryList for dropdown options
    builder.addCase(fetchCategoryList.pending, (state) => {
      state.fetchCategoryListLoading = true;
      // state.isEditError = false;
    });
    builder.addCase(fetchCategoryList.fulfilled, (state, action) => {
      state.fetchCategoryListLoading = false;
      // state.isEditError = false;
    });
    builder.addCase(fetchCategoryList.rejected, (state, action) => {
      state.fetchCategoryListLoading = false;
      // state.isEditError = true;
    });

    // fetchTaxList for dropdown options
    builder.addCase(fetchTaxList.pending, (state) => {
      state.fetchTaxListLoading = true;
      // state.isEditError = false;
    });
    builder.addCase(fetchTaxList.fulfilled, (state, action) => {
      state.fetchTaxListLoading = false;
      // state.isEditError = false;
    });
    builder.addCase(fetchTaxList.rejected, (state, action) => {
      state.fetchTaxListLoading = false;
      // state.isEditError = true;
    });
  },
});

export const {
  editProduct,
  emptyProduct,
  updateFormValue,
  changeShowType,
  setVarientList,
  changeShowStatus,
} = productsSlice.actions;
export default productsSlice.reducer;
