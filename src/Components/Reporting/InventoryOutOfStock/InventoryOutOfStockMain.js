import React, { useState } from "react";
import InventoryOutOfStockList from "./InventoryOutOfStockList";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import InventoryTable from "../InventoryReport/InventoryTable";

const InventoryOutOfStockMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const [selectedOrderSource, setSelectedOrderSource] = useState("Product");
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
    "Low Inventory",
    "All inventory",
    "Out of stock"
  ];


  const initialColumns = [
    { id: "sku", name: "SKU name" },
    { id: "outlet", name: "Outlet" },
    { id: "plus_after_sku", name: "+" },
    { id: "closing_inventory", name: "Closing Inventory" },
    // { id: "items_sold_per_day", name: "Items sold per day" },
    { id: "items_sold", name: "Items sold" },
    { id: "inbound_inventory", name: "Inbound inventory" },
    { id: "last_sale", name: "Last Sale" },
    { id: "revenue", name: "Revenue" },
    { id: "current_inventory", name: "Current Inventory" },
    { id: "plus_after_avg_cost", name: "+" },
  ];
  const initialData = [
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: -2,
      items_sold: 2,
      days_cover: 1.5,
      avg_cost: "$10.00",
      brand: "Brand A",
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
      revenue: "$10.00",
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:-2,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:0,
      items_sold_per_day: 0.4,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "Sep 19",
      last_received: "2023-04-01",
      outlet:"Main Outlet"
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: -2,
      items_sold: 2,
      days_cover: 1,
      avg_cost: "$10.00",
      brand: "Brand A",
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
      revenue: "$10.00",
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:-2,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:0,
      items_sold_per_day: 0.1,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "Sep 19",
      last_received: "2023-04-01",
      outlet:"Main Outlet"
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: -2,
      items_sold: 2,
      days_cover: "",
      avg_cost: "",
      brand: "Brand A",
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
      revenue: "$10.00",
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:-2,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:0,
      items_sold_per_day: 0.1,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "Sep 19",
      last_received: "2023-04-01",
      outlet:"Main Outlet"
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: -2,
      items_sold: 2,
      days_cover: "",
      avg_cost: "",
      brand: "Brand A",
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
      revenue: "$10.00",
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:-2,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:0,
      items_sold_per_day: 0.8,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "Sep 19",
      last_received: "2023-04-01",
       outlet:"Main Outlet"
    },
    {
      sku: "10012",
      name: "Product Name 1",
      closing_inventory: -2,
      items_sold: 2,
      days_cover: "",
      avg_cost: "",
      brand: "Brand A",
      supplier: "Supplier A",
      category: "Category A",
      supplier_code: "SC001",
      revenue: "$10.00",
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted:10,
      avg_sale_value: 70,
      cost_goods_sold:90,
      retail_value:40,
      current_inventory:-2,
      start_date_inventory:"2023-02-01",
      reorder_point:10,
      reorder_amount:90,
      return_count:700,
      inventory_days_cover:1.5,
      inventory_returns:20,
      inbound_inventory:0,
      items_sold_per_day: 0.1,
      inventory_cost:70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "Sep 19",
      last_received: "2023-04-01",
      outlet:"Main Outlet"
    },
  ];

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

export default InventoryOutOfStockMain;
