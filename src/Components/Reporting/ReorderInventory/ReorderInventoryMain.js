import React, { useEffect, useState } from "react";
import ReorderInventoryList from "./ReorderInventoryList";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import InventoryTable from "../InventoryReport/InventoryTable";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import axios from 'axios';
import { useAuthDetails } from "../../../Common/cookiesHelper";


const ReorderInventoryMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
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

  

const fetchProductsData = async () => {
  try {
    const payload = {
      merchant_id:  'JAI16179CA' , //LoginGetDashBoardRecordJson?.data?.merchant_id , // 'JAI16179CA',
      format: 'json',
      category_id: 'all',
      show_status: 'all',
      listing_type: 0,
      offset: 0,
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
    setProductListData(products)
    return products;  // Return the products for further use
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

  useEffect(()=>{
    fetchProductsData()
  })


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
      <InventoryTable initialColumns={initialColumns} initialData={initialData}/>
    </>
  );
};

export default ReorderInventoryMain;
