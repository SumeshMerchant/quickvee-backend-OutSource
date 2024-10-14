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

  const [selectedDateRange, setSelectedDateRange] = useState(getCurrentDate());
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const [hasMore, setHasMore] = useState(true);
  const [initialColumns, setInitialColumns] = useState([
    { id: "name", name: "Product Name" },
    { id: "plus_after_sku", name: "+" },
    { id: "closing_inventory", name: "Closing Inventory" },
    { id: "items_sold_per_day", name: "Items sold per day" },
    { id: "items_sold", name: "Items sold" },
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
  const [selectedOrderSource, setSelectedOrderSource] = useState("Product");
  const [productListData, setProductListData] = useState([]);
  const [selectedOrderType, setSelectedOrderType] = useState("All inventory");
  const [totalRecords, setTotalRecords] = useState(null);
  const showcat = 0;
  const reportTypeList = [
    "Product",
    "Brand",
    "Vendor",
    "Category",
  ];
  const measureTypeList = [
    "On-hand-inventory",
    "Low inventory",
    "All inventory",
    "Out of stock",
  ];
  const handleDateRangeChange = (dateRange) => {
    setPage(1);
    setSelectedDateRange(dateRange); 
    fetchProductsData(1,selectedOrderType,dateRange,selectedOrderSource)
    fetchRecordTotal(1,selectedOrderType,dateRange,selectedOrderSource)
  };
  const createPayload = (pageNum = null, limit = null, measureType, dateRange,reportType) => ({
    merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
    token_id: LoginGetDashBoardRecordJson?.token_id,
    login_type: LoginGetDashBoardRecordJson?.login_type,
    ...(pageNum !== null && { page: pageNum }), 
    ...(limit !== null && { limit: limit }),  
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    measure_type: measureType,
    report_type:reportType
  });

  const fetchRecordTotal = async (page=1,measureType="All inventory",dateRange,reportType="Product") => {
    const payload = createPayload(0,0,measureType, dateRange,reportType);
    try {
      // setLoading(true);
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
      // setLoading(false);
    }
  }

  const fetchProductsData = async (page=1,measureType="All inventory",dateRange,reportType="Product") => {
    try {
      const payload = createPayload(page, 10,measureType, dateRange,reportType);
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
      fetchProductsData(prevPage,selectedOrderType,selectedDateRange,selectedOrderSource );
    }
  };
  const handleOptionClick = (option, dropdown) => {
    setPage(1);
    switch (dropdown) {
      case "orderSource":
      setInitialColumns((prevColumns) => {
          let updatedColumns = [...prevColumns];
          if (option.title === "Product") {
            updatedColumns[0] = { id: "name", name: "Product Name" };
            updatedColumns.splice(1, 0,{ id: "plus_after_sku", name: "+" });
          } else {
            updatedColumns[0] = { id: option.title.toLowerCase(), name: option.title };
            updatedColumns = updatedColumns.filter(item => item.id !== "plus_after_sku");
          }
          const dataArray = [
            { id: "brand", name: "Brand" },
            { id: "vendor", name: "Vendor" },
            { id: "category", name: "Category" },
            { id: "tag", name: "Tag" }
          ]
          setreportType((prevReportType) => {
            const lowerCaseTitle = option.title.toLowerCase();
            if (lowerCaseTitle === "brand" || lowerCaseTitle === "vendor") {
              return dataArray.filter(
                (item) => !["category", "tag", lowerCaseTitle].includes(item.id)
              );
            }
            return dataArray.filter((item) => item.id !== lowerCaseTitle);
          });
          return updatedColumns;
        });

        setSelectedOrderSource(option.title);
        fetchProductsData(1,selectedOrderType,selectedDateRange,option.title);
        fetchRecordTotal(1,option.title,selectedDateRange,selectedOrderSource)
        break;
      case "orderType":
        setProductListData([])
        setSelectedOrderType(option.title);
        setPage(1);
        fetchProductsData(1,option.title,selectedDateRange,selectedOrderSource);
        fetchRecordTotal(1,option.title,selectedDateRange,selectedOrderSource)

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedOrderType("All inventory")
    fetchRecordTotal(1,"All inventory",selectedDateRange,"Product")
    fetchProductsData(1,"All inventory",selectedDateRange, "Product");
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
        totalRecords={totalRecords}
              />
       {/* )}  */}
    </>
  );
};


export default ReorderInventoryMain;
