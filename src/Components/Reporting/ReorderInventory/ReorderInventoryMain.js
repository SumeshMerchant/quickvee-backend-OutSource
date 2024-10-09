import React, { useEffect, useState } from "react";
import ReorderInventoryList from "./ReorderInventoryList";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import InventoryTable from "../InventoryReport/InventoryTable";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import axios from 'axios';
import { useAuthDetails } from "../../../Common/cookiesHelper";
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

const ReorderInventoryMain = () => {
  const defaultDateRange = getCurrentDate();

  const [selectedDateRange, setSelectedDateRange] = useState(defaultDateRange);
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const [hasMore, setHasMore] = useState(true);
  const [initialColumns, setInitialColumns] = useState([
    { id: "name", name: "Product Name" },
    { id: "plus_after_sku", name: "+" },
    { id: "closing_inventory", name: "Closing Inventory" },
    { id: "items_sold_per_day", name: "Items sold per day" },
    { id: "times_sold", name: "Items sold" },
    { id: "inbound_inventory", name: "Inbound Inventory" },
    { id: "inventory_days_cover", name: "Days Cover" },
    { id: "avg_cost", name: "Avg. cost" },
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
  const handleDateRangeChange = (dateRange) => {
    setPage(1);
    setSelectedDateRange(dateRange); 
    fetchProductsData(1,selectedOrderType,dateRange)
    fetchRecordTotal(selectedOrderType,dateRange)
  };
  const [selectedOrderSource, setSelectedOrderSource] = useState("Product");
  const [productListData, setProductListData] = useState([]);

  const [selectedOrderType, setSelectedOrderType] = useState("All inventory");

 

  const showcat = 0;
  const reportTypeList = [
    "Product",
    "Brand",
    "Outlet",
    "Vendor",
    "Category",
  ];
  const measureTypeList = [
    "On-hand-inventory",
    "Low inventory",
    "All inventory",
    "Out of stock",
  ];

  const createPayload = (pageNum,measureType, dateRange) => ({
    merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
    token_id: LoginGetDashBoardRecordJson?.token_id,
    login_type: LoginGetDashBoardRecordJson?.login_type,
    limit: 10,
    page: pageNum,
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    measureType: measureType,
  });

  const fetchRecordTotal = async (measureType="All inventory",dateRange) => {
    const payload = createPayload(measureType, dateRange);
    // Reorder_total_list
    const response = await axios.post(
      `${Config.BASE_URL}${Config.REORDER_TOTAL_LIST}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${LoginGetDashBoardRecordJson?.token}`,
        },
      }
    );
    // console.log("=-=-=-response",response)
  }

  const fetchProductsData = async (page=0,measureType="All inventory",dateRange) => {
    try {
      setLoading(true);
      const payload = createPayload(page,measureType, dateRange);
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

      if(response?.data && !response?.data?.status){
        setProductListData([])
      }
      const products = response?.data?.reorder_array;
      if (products && products.length < 10) {
        setHasMore(false); 
      }
      if (products && products.length > 0 && page == 0) {
        setProductListData(products);
      } else if (products && products.length > 0 && page != 0) {
        setProductListData([...productListData, ...products]);
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
            const dataArray = [
              { id: "brand", name: "Brand" },
              { id: "vendor", name: "Vendor" },
              { id: "category", name: "Category" },
              { id: "tag", name: "Tag" }
            ]
            setreportType((prevReportType) =>
            dataArray.filter((item) => item.id !== option.title.toLowerCase())
          );
          }
          
          return updatedColumns;
        });

        setSelectedOrderSource(option.title);
        break;
      case "orderType":
        setSelectedOrderType(option.title);
        setPage(1);
        fetchProductsData(1,option.title,selectedDateRange);
        fetchRecordTotal(option.title,selectedDateRange)

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedOrderType("All inventory")
    fetchRecordTotal("All inventory",selectedDateRange)
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

      {/* <InventoryTable
        initialColumns={initialColumns}
        initialData={productListData}
        scrollForProduct={fetchMoreData}
        hasMore={hasMore}
      /> */}
      {/* {loading ? (
        <></>
      ) :( */}
        <InventoryTable
        initialColumns={initialColumns}
        initialData={productListData}
        scrollForProduct={fetchMoreData}
        hasMore={hasMore}
        loading={loading}
        reportType={reportType}
              />
       {/* )}  */}
    </>
  );
};


export default ReorderInventoryMain;
