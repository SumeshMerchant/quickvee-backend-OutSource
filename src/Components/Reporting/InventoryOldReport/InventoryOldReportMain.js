import React, { useState } from "react";
import InventoryOldReportList from "./InventoryOldReportList";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import { Grid } from "@mui/material";
import InventoryTable from "../InventoryReport/InventoryTable";

const InventoryOldReportMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const [selectedOrderSource, setSelectedOrderSource] = useState("SKU Name");
  const [selectedOrderType, setSelectedOrderType] =
    useState("On-hand-inventory");

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
    "SKU Name",
    "Brand",
    "Outlet",
    "Supplier",
    "Product category",
  ];
  const measureTypeList = [
    "On-hand-inventory",
    "Low Inventory",
    "Out of stock",
    "All inventory"
  ];

  const initialColumns = [
    { id: "sku", name: "SKU name" },
    { id: "plus_after_sku", name: "+" },
    { id: "closing_inventory", name: "Closing Inventory" },
    { id: "sell_through_rate", name: "Sell-through rate" },
    { id: "last_sale", name: "Last sale" },
    { id: "inventory_cost", name: "Inventory cost" },
    { id: "retail_value", name: "Retail value(excel. tax)" },
    { id: "last_received", name: "Last received" },
    { id: "plus_after_avg_cost", name: "+" },
  ];
  const initialData = [
    {
      sku: "001",
      name: "Product A",
      closing_inventory: 100,
      items_sold: 20,
      days_cover: 5,
      avg_cost: 10,
      brand: "Brand A",
      vendor: "Vendor A",
      category: "Category A",
      revenue: 200,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      avg_items_per_sale: 70,
      sale_discounted: 10,
      avg_sale_value: 70,
      cost_goods_sold: 90,
      retail_value:"$200",
      current_inventory: 30,
      start_date_inventory: "2023-02-01",
      reorder_point: 10,
      reorder_amount: 90,
      return_count: 700,
      inventory_days_cover: 30,
      inventory_returns: 20,
      inbound_inventory: 70,
      items_sold_per_day: 60,
      inventory_cost: 70,
      avg_cost_measure: 12,
      self_through_rate: 1.5,
      created: "2023-01-01",
      first_sale: "2023-02-01",
      last_sale: "Sep 15",
      last_received: "2023-04-01",
    },
    {
      sku: "002",
      name: "Product B",
      closing_inventory: 200,
      items_sold: 30,
      days_cover: 10,
      sell_through_rate: "30%",
      avg_cost: 15,
      brand: "Brand B",
      vendor: "Vendor A",
      category: "Category B",
      revenue: 400,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      inventory_cost: 70,
      avg_items_per_sale: 70,
      avg_sale_value: 70,
      cost_goods_sold: 90,
      retail_value: "$200",
      current_inventory: 30,
      start_date_inventory: "2023-02-01",
      reorder_point: 10,
      reorder_amount: 90,
      return_count: 700,
      inventory_days_cover: 30,
      inventory_returns: 20,
      inbound_inventory: 70,
      items_sold_per_day: 60,
      sale_discounted: 10,
      avg_cost_measure: 14,
      self_through_rate: 2.0,
      created: "2023-01-02",
      first_sale: "2023-02-02",
      last_sale: "Sep 15",
      last_received: "2023-04-02",
    },
    {
      sku: "003",
      name: "Product C ",
      closing_inventory: 200,
      items_sold: 30,
      days_cover: 10,
      sell_through_rate: "30%",
      avg_cost: 15,
      brand: "Brand B",
      vendor: "Vendor A",
      category: "Category B",
      revenue: 400,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      inventory_cost: 70,
      avg_items_per_sale: 70,
      avg_sale_value: 70,
      cost_goods_sold: 90,
      retail_value:"$200",
      current_inventory: 30,
      start_date_inventory: "2023-02-01",
      reorder_point: 10,
      reorder_amount: 90,
      return_count: 700,
      inventory_days_cover: 30,
      inventory_returns: 20,
      inbound_inventory: 70,
      items_sold_per_day: 60,
      sale_discounted: 10,
      avg_cost_measure: 14,
      self_through_rate: 2.0,
      created: "2023-01-02",
      first_sale: "2023-02-02",
      last_sale: "Sep 15",
      last_received: "2023-04-02",
    },
    {
      sku: "004",
      name: "Product D",
      closing_inventory: 200,
      items_sold: 30,
      days_cover: 10,
      sell_through_rate: "40%",
      avg_cost: 15,
      brand: "Brand B",
      vendor: "Vendor A",
      category: "Category B",
      revenue: 400,
      gross_profit: 12,
      sale_margin: 10,
      customer_count: 20,
      sale_count: 50,
      inventory_cost: 70,
      avg_items_per_sale: 70,
      sale_discounted: 10,
      avg_sale_value: 70,
      cost_goods_sold: 90,
      retail_value: "$200",
      current_inventory: 30,
      start_date_inventory: "2023-02-01",
      reorder_point: 10,
      reorder_amount: 90,
      return_count: 700,
      inventory_days_cover: 30,
      inventory_returns: 20,
      inbound_inventory: 70,
      items_sold_per_day: 60,
      avg_cost_measure: 14,
      self_through_rate: 2.0,
      created: "2023-01-02",
      first_sale: "2023-02-02",
      last_sale: "Sep 15",
      last_received: "2023-04-02",
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
      <Grid container sx={{mt: 3}}>
        <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
      <InventoryTable initialColumns={initialColumns} initialData={initialData} />
    </>
  );
};

export default InventoryOldReportMain;
