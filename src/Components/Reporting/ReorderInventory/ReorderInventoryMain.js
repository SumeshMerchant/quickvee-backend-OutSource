import React, { useEffect, useState } from "react";
import ReorderInventoryList from "./ReorderInventoryList";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import InventoryTable from "../InventoryReport/InventoryTable";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import axios from 'axios';
import { useAuthDetails } from "../../../Common/cookiesHelper";
import Skeleton from 'react-loading-skeleton'; 

const ReorderInventoryMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Track current page number
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const [selectedOrderSource, setSelectedOrderSource] = useState("SKU Name");
  const [productListData, setProductListData] = useState([]);

  const [selectedOrderType, setSelectedOrderType] =
    useState("All inventory");

  const handleOptionClick = (option, dropdown) => {
    switch (dropdown) {
      case "orderSource":
        setSelectedOrderSource(option.title);

        break;
      case "orderType":
        setSelectedOrderType(option.title);

        break;
      default:
        break;
    }
  };

  // console.log("=-=-LoginGetDashBoardRecordJson",JSON.stringify(LoginGetDashBoardRecordJson))
const showcat = 0;
  const reportTypeList = [
    "Product",
    "SKU Name",
    "Brand",
    "Outlet",
    "Supplier",
    "Product category",
  ];
  const measureTypeList = [
    "On-hand-inventory",
    "Low inventory",
    "All inventory",
    "Out of stock"
  ];

  const initialColumns = [
    { id: "sku", name: "Product Name" },
    { id: "plus_after_sku", name: "+" },
    { id: "closing_inventory", name: "Closing Inventory" },
    { id: "items_sold_per_day", name: "Items sold per day" },
    { id: "items_sold", name: "Items Sold" },
    { id: "inbound_inventory", name: "Inbound Inventory" },
    { id: "days_cover", name: "Days cover" },
    { id: "avg_cost", name: "Avg. cost" },
    { id: "plus_after_avg_cost", name: "+" },
  ];
  const initialData = [
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: 4,
      items_sold: 39,
      days_cover: 1.5,
      avg_cost: "$10.00",
      brand: "Brand A",
      vendor: "Vendor A",
      category: "Category A",
      revenue: 200,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:30,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:"",
      items_sold_per_day: 0.4,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "2023-03-01",
      last_received: "2023-04-01",
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: 4,
      items_sold: 12,
      days_cover: 1,
      avg_cost: "$10.00",
      brand: "Brand A",
      vendor: "Vendor A",
      category: "Category A",
      revenue: 200,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:30,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:"",
      items_sold_per_day: 0.1,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "2023-03-01",
      last_received: "2023-04-01",
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: "",
      items_sold: 11,
      days_cover: "",
      avg_cost: "",
      brand: "Brand A",
      vendor: "Vendor A",
      category: "Category A",
      revenue: 200,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:30,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:"",
      items_sold_per_day: 0.1,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "2023-03-01",
      last_received: "2023-04-01",
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: "",
      items_sold: 7,
      days_cover: "",
      avg_cost: "",
      brand: "Brand A",
      vendor: "Vendor A",
      category: "Category A",
      revenue: 200,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:30,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:"",
      items_sold_per_day: 0.8,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "2023-03-01",
      last_received: "2023-04-01",
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: "",
      items_sold: 9,
      days_cover: "",
      avg_cost: "",
      brand: "Brand A",
      vendor: "Vendor A",
      category: "Category A",
      revenue: 200,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:30,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:"",
      items_sold_per_day: 0.1,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "2023-03-01",
      last_received: "2023-04-01",
    },
  ];


  const fetchProductsData = async (currentPage) => {
   
  try {
   
    const payload = {
      merchant_id:  'JAI16179CA' , //LoginGetDashBoardRecordJson?.data?.merchant_id , // 'JAI16179CA',
      format: 'json',
      category_id: 'all',
      show_status: 'all',
      listing_type: 0,
      offset: currentPage * 10,
      limit: 10,
      page: 0,
      token_id: '7691', //LoginGetDashBoardRecordJson?.token_id, //'7691',
      login_type: LoginGetDashBoardRecordJson?.login_type //'superadmin'
    }
    const response = await axios.post(
      'https://production.quickvee.net/Product_api_react/Products_list',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer 08ad7136136aff9a13cf14701ade857690726d8f6719c28482ff08703d08`, // ${LoginGetDashBoardRecordJson?.token}
        },
      }
    );

    const products = response.data;
    if (products.length < 10) {
      setHasMore(false);
    }
    const mapProductData = (productData) => {
      return productData.map((product) => ({
        sku: product.sku || product.id,  // Using id if sku is null
        name: product.title,
        closing_inventory: parseInt(product.quantity) || 0,
        items_sold: product.reorder_qty || 0,
        days_cover: 0,  // Value not directly available, default to 0 or calculated later
        avg_cost: `$${parseFloat(product.costperItem).toFixed(2)}`,
        brand: product.brand,
        vendor: "Vendor A",  // Assuming vendor not available, static or mapped if possible
        category: product.category_name.split(',')[0],  // Picking the first category
        revenue: parseFloat(product.profit) || 0,
        gross_profit: parseFloat(product.profit) || 0,
        sale_margin: parseFloat(product.margin) || 0,
        customer_count: 0,  // Assuming not available in the API response
        sale_count: 0,  // Assuming not available in the API response
        avg_items_per_sale: 0,  // Assuming not available in the API response
        sale_discounted: 0,  // Assuming not available in the API response
        avg_sale_value: 0,  // Assuming not available in the API response
        cost_goods_sold: parseFloat(product.costperItem) || 0,
        retail_value: 0,  // Assuming not available in the API response
        current_inventory: parseInt(product.quantity) || 0,
        start_date_inventory: product.created_on,
        reorder_point: parseInt(product.reorder_level) || 0,
        reorder_amount: parseInt(product.reorder_qty) || 0,
        return_count: 0,  // Assuming not available in the API response
        inventory_days_cover: 0,  // Assuming not available in the API response
        inventory_returns: 0,  // Assuming not available in the API response
        inbound_inventory: "",  // Assuming not available in the API response
        items_sold_per_day: 0,  // Assuming not available in the API response
        inventory_cost: parseFloat(product.costperItem) || 0,
        avg_cost_measure: parseFloat(product.costperItem) || 0,
        self_through_rate: 0,  // Assuming not available in the API response
        created: product.created_on,
        first_sale: "",  // Assuming not available in the API response
        last_sale: "",  // Assuming not available in the API response
        last_received: product.updated_on,
      }));
    };
    
    // Example usage:
    const mappedData = mapProductData(products);
    // console.log(mappedData);
    setProductListData(prevData => [...prevData, ...mappedData]);
    // setProductListData(mappedData)
    return products;  // Return the products for further use
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    // setLoading(false); // Set loading to false after fetching
  }
  }
  const fetchMoreData = () => {
    // Increment the page number and fetch the next set of data
    setPage(prevPage => prevPage + 1);
    fetchProductsData(page + 1); // Fetch data for the next page
  };

  useEffect(() => {
    // Initial fetch when component mounts
    fetchProductsData(page);
  }, []);
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    console.log("=-=-=scrollTop, clientHeight, scrollHeight ",scrollTop, clientHeight, scrollHeight )
    // Check if we've reached the bottom
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setPage((prevPage) => prevPage + 1); // Increment the page
    }
  };
  // const handleScroll = () => {
  //   // You can handle other actions related to scrolling if necessary
  //   console.log("Scrolling for product...");
  // };
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container sx={{ px: 2.5, pt: 2.3 }}>
            <Grid item xs={12}>
              <div className="filter-heading">Filter By</div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ px: 2.5, pb: 2.2 }}>
            <Grid item xs={12} sm={6} md={showcat != 0 ? 4 : 4}>
              <label
                className="q-details-page-label"
                htmlFor="orderSourceFilter"
              >
                Report Type
              </label>
              <SelectDropDown
                sx={{ pt: 0.5 }}
                listItem={reportTypeList.map((item) => ({ title: item }))}
                title={"title"}
                dropdownFor={"orderSource"}
                selectedOption={selectedOrderSource}
                onClickHandler={handleOptionClick}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={showcat != 0 ? 4 : 4}>
              <label
                className="q-details-page-label"
                htmlFor="orderSourceFilter"
              >
                Measure
              </label>
              <SelectDropDown
                sx={{ pt: 0.5 }}
                listItem={measureTypeList.map((item) => ({ title: item }))}
                title={"title"}
                dropdownFor={"orderType"}
                selectedOption={selectedOrderType}
                onClickHandler={handleOptionClick}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{}}>
        <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
      {/* <InventoryTable initialColumns={initialColumns} initialData={productListData}/> */}

      <InventoryTable 
          initialColumns={initialColumns} 
          initialData={productListData} 
          scrollForProduct={fetchMoreData} 
          hasMore={hasMore}
        />
      {/* {loading ? (
       <Skeleton count={5} height={50} />  
      ) : (
        <InventoryTable 
          initialColumns={initialColumns} 
          initialData={productListData} 
          scrollForProduct={fetchMoreData} 
          hasMore={hasMore}
        />
      )} */}
    </>
  );
};

export default ReorderInventoryMain;
