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
  return `${year}-${month}-${day}`;
};

const ReorderInventoryMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState({
    start_date: getCurrentDate(),
    end_date: getCurrentDate(), 
  });

  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const handleDateRangeChange = (dateRange) => {
    const updatedData = {
      ...dateRange,
    };
    setSelectedDateRange(updatedData);
    fetchProductsData(page);
  };
  const [selectedOrderSource, setSelectedOrderSource] = useState("SKU Name");
  const [productListData, setProductListData] = useState([]);

  const [selectedOrderType, setSelectedOrderType] = useState("All inventory");

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
    "Low inventory",
    "All inventory",
    "Out of stock",
  ];

  const initialColumns = [
    { id: "name", name: "Product" },
    { id: "plus_after_sku", name: "+" },
    { id: "net_sale", name: "Net Sale" },
    { id: "closing_inventory", name: "Closing Inventory" },
    { id: "items_sold_per_day", name: "Items sold per day" },
    { id: "inventory_days_cover", name: "Days Cover" },
    { id: "sell_through_rate", name: "Sell-through rate" },
    { id: "revenue", name: "Revenue" },
    { id: "gross_profit", name: "Gross Pro" },
    { id: "avg_cost", name: "Avg. cost" },
    { id: "avg_sale_value", name: "Avg. sale value" },
    { id: "avg_items_per_sale", name: "Avg. items per sale" },
    { id: "items_sold", name: "Avg. items per sale" },
    { id: "sale_count", name: "Sale count" },
    { id: "customer_count", name: "Customer count" },
    { id: "sale_margin", name: "Margin (%)" },
    { id: "gross_profit", name: "Gross profit" },
    { id: "times_sold", name: "Items sold" },
    { id: "quantity", name: "Quantity" },
    { id: "reorder_qty", name: "Reorder Qty" },
    { id: "reorder_level", name: "Reorder Level" },
    { id: "item_price", name: "Items price" },
    { id: "instock", name: "Instock" },
    { id: "variant", name: "Variant" },
    { id: "plus_after_avg_cost", name: "+" },
  ];

  const fetchProductsData = async (currentPage) => {
    try {
      setLoading(true);
      const payload = {
        merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
        token_id: LoginGetDashBoardRecordJson?.token_id,
        login_type: LoginGetDashBoardRecordJson?.login_type,
        limit: 10,
        page: page,
        ...selectedDateRange
      };
      const response = await axios.post(
        // `${Config.BASE_URL}${Config.GET_REORDER_INVENTORY_LIST}`,Invenrory_report/Reorder_list
        `${Config.BASE_URL}Invenrory_report/Reorder_list`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${LoginGetDashBoardRecordJson?.token}`,
          },
        }
      );

      const products = response?.data?.reorder_array;
      if (products.length < 10) {
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
    setPage(prevPage => prevPage + 1);
    fetchProductsData(page + 1);
  };


  useEffect(() => {
   
    fetchProductsData(page);
  }, [selectedDateRange]);

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
      />
       {/* )}  */}
    </>
  );
};


export default ReorderInventoryMain;
