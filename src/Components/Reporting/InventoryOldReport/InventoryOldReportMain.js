import React, { useEffect, useState } from "react";
import InventoryOldReportList from "./InventoryOldReportList";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import { Grid } from "@mui/material";
import InventoryTable from "../InventoryReport/InventoryTable";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import axios from 'axios';
import Config from "../../../Constants/Config";
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const endDate = `${year}-${month}-${day}`;
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 6);
  const pastYear = pastDate.getFullYear();
  const pastMonth = String(pastDate.getMonth() + 1).padStart(2, '0');
  const pastDay = String(pastDate.getDate()).padStart(2, '0');
  const startDate = `${pastYear}-${pastMonth}-${pastDay}`;

  return {
    start_date: startDate,
    end_date: endDate
  };
};
const InventoryOldReportMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(getCurrentDate());
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const [hasMore, setHasMore] = useState(true);
  const [initialColumns, setInitialColumns] = useState([
    { id: "sku", name: "SKU name" },
    { id: "plus_after_sku", name: "+" },
    { id: "closing_inventory", name: "Closing Inventory" },
    { id: "sell_through_rate", name: "Sell-through rate" },
    { id: "last_sale", name: "Last sale" },
    { id: "inventory_cost", name: "Inventory cost" },
    { id: "retail_value", name: "Retail value(excel. tax)" },
    { id: "last_received", name: "Last received" },
    { id: "plus_after_avg_cost", name: "+" },
  ]);
  const [reportType, setreportType] = useState([
    { id: "brand", name: "Brand" },
    { id: "vendor", name: "Vendor" },
    { id: "category", name: "Category" },
    { id: "tag", name: "Tag" }
  ]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [productListData, setProductListData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(null);












  const [selectedOrderSource, setSelectedOrderSource] = useState("SKU Name");
  const [selectedOrderType, setSelectedOrderType] =
    useState("On-hand-inventory");
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
      retail_value:200,
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
      sell_through_rate: 30,
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
      retail_value: 200,
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
      sell_through_rate: 30,
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
      retail_value:200,
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
      sell_through_rate: 40,
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
      retail_value: 200,
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

  const handleDateRangeChange = (dateRange) => {
    setPage(1);
    setSelectedDateRange(dateRange); 
    fetchProductsData(1,selectedOrderType,dateRange)
    fetchRecordTotal(1,selectedOrderType,dateRange)
  };
  const createPayload = (pageNum = null, limit = null, measureType, dateRange) => ({
    merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
    token_id: LoginGetDashBoardRecordJson?.token_id,
    login_type: LoginGetDashBoardRecordJson?.login_type,
    ...(pageNum !== null && { page: pageNum }), 
    ...(limit !== null && { limit: limit }),  
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    measureType: measureType,
  });

  const fetchRecordTotal = async (page=1,measureType="All inventory",dateRange) => {
    const payload = createPayload(0,0,measureType, dateRange);
    // Reorder_total_list
    try {
      setLoading(true);
    const totalApiResponse = await axios.post(
      `${Config.BASE_URL}${Config.REORDER_TOTAL_LIST}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${LoginGetDashBoardRecordJson?.token}`,
        },
      }
    );
    if(totalApiResponse?.status){
      const totalResponseData = totalApiResponse?.data?.totals
      setTotalRecords(totalResponseData);
    }
    } catch (error) {
      console.error("Error fetching totals:", error); 
       
    } finally {
      setLoading(false);
    }
  }

  const fetchProductsData = async (page=1,measureType="All inventory",dateRange) => {
    try {
      const payload = createPayload(page, 50,measureType, dateRange);
      if(page ==1){
        setLoading(true);
      }
      const response = await axios.post(
        // `${Config.BASE_URL}${Config.GET_REORDER_INVENTORY_LIST}`,Invenrory_report/Reorder_list
        `${Config.BASE_URL}${Config.GET_REORDER_INVENTORY_LIST}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${LoginGetDashBoardRecordJson?.token}`,
          },
        }
      );

      if(response?.data && !response?.data?.status && response?.data?.page==1){
        setProductListData([])
      }
      const products = response?.data?.reorder_array;
      if (products && products.length < 10) {
        setHasMore(false); 
      }
      if (products && products.length > 0 && page == 1) {
        setProductListData(products);
      } else if (products && products.length > 0 && page != 1) {
        setProductListData([...productListData, ...products]);
      }
      if(page >1 && !products){
        setHasMore(false); 
      }
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMoreData = () => {
    if (hasMore ) {
      setPage((prevPage) => prevPage + 1);
      const prevPage = page +1
      // fetchProductsData();
      fetchProductsData(prevPage,selectedOrderType,selectedDateRange);
    }
  };
  const handleOptionClick = (option, dropdown) => {

    switch (dropdown) {
      case "orderSource":
        setInitialColumns((prevColumns) => {
          const updatedColumns = [...prevColumns];
          if(option.title==="Product"){
            updatedColumns[0] = { id: "name", name: "Product Name" };
          }else if(option.title==="Outlet"){
            updatedColumns[0] = { id: "outlet", name: "Outlet" };
          }else{
            updatedColumns[0] = { id: option.title.toLowerCase(), name: option.title };
          } 
          const dataArray = [
            { id: "brand", name: "Brand" },
            { id: "vendor", name: "Vendor" },
            { id: "category", name: "Category" },
            { id: "tag", name: "Tag" } 
          ]
          setreportType((prevReportType) =>
          dataArray.filter((item) => item.id !== option.title.toLowerCase())
        );
          return updatedColumns;
        });

        setSelectedOrderSource(option.title);
        break;
      case "orderType":
        setProductListData([])
        setSelectedOrderType(option.title);
        setPage(1);
        fetchProductsData(1,option.title,selectedDateRange);
        fetchRecordTotal(1,option.title,selectedDateRange)

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedOrderType("All inventory")
    fetchRecordTotal(1,"All inventory",selectedDateRange)
    fetchProductsData(1,"All inventory",selectedDateRange);
  }, []);

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
      <InventoryTable
        initialColumns={initialColumns}
        initialData={productListData}
        scrollForProduct={fetchMoreData}
        hasMore={hasMore}
        loading={loading}
        reportType={reportType}
        totalRecords={totalRecords}
              />
    </>
  );
};

export default InventoryOldReportMain;
