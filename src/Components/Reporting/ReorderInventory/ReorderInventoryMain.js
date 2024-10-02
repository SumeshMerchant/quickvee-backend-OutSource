import React, { useState } from "react";
import ReorderInventoryList from "./ReorderInventoryList";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import InventoryTable from "../InventoryReport/InventoryTable";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";

const ReorderInventoryMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const [selectedOrderSource, setSelectedOrderSource] = useState("SKU name");
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
  const showcat = 0;
  const reportTypeList = [
    "Product",
    "SKU name",
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
    { id: "sku", name: "SKU name" },
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
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
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
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
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
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
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
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
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
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
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
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container sx={{ px: 2.5, pt: 1 }}>
            <Grid item xs={12}>
              <div className="heading">Filter By</div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ px: 2.5, pb: 2.5 }}>
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
