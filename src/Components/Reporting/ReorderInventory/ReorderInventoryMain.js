import React, { useEffect, useState } from "react";
import ReorderInventoryList from "./ReorderInventoryList";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import InventoryTable from "../InventoryReport/InventoryTable";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import axios from 'axios';
import { useAuthDetails } from "../../../Common/cookiesHelper";
import Config from "../../../Constants/Config";


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


  const fetchProductsData = async (currentPage) => {
    
    try {
      setLoading(true)
      const payload = {
        "merchant_id": "JAI16179CA",
        "format": "json",
        "category_id": "all",
        "show_status": "all",
        "listing_type": 0,
        "offset": currentPage * 10,
        "limit": 10,
        "page": 0,
        "token_id": 7691,
        "login_type": "superadmin"
      }
      const response = await axios.post(
        `${Config.BASE_URL}${Config.PRODUCTS_LIST}`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${LoginGetDashBoardRecordJson?.token}`
          },
        }
      );

      const products = response?.data;
      if (products.length < 10) {
        setHasMore(false);
      }
      const mapProductData = (productData) => {
        return productData?.map((product) => {
          return {
            sku: product.sku || product.id,
            name: product.title || product.item_name,
            closing_inventory: parseInt(product.quantity) || 0,
            items_sold: product.reorder_qty || 0,
            days_cover: 0,
            avg_cost: product?.costperItem ? `$${parseFloat(product?.costperItem).toFixed(2)}` : "",
            brand: product.brand,
            vendor: "Vendor A" || product.cost_vendor,
            category: product?.category_name || product.category,
            revenue: parseFloat(product.profit) || 0,
            gross_profit: parseFloat(product.profit) || 0,
            sale_margin: parseFloat(product.margin) || 0,
            customer_count: 0,
            sale_count: 0,
            avg_items_per_sale: 0,
            sale_discounted: 0,
            avg_sale_value: 0,
            cost_goods_sold: parseFloat(product.costperItem) || 0,
            retail_value: 0,
            current_inventory: parseInt(product.quantity) || product?.reorder_qty || 0,
            start_date_inventory: product.created_on,
            reorder_point: parseInt(product.reorder_level) || 0,
            reorder_amount: parseInt(product.reorder_qty) || 0,
            return_count: 0,
            inventory_days_cover: 0,
            inventory_returns: 0,
            inbound_inventory: "",
            items_sold_per_day: 0,
            inventory_cost: parseFloat(product.costperItem) || 0,
            avg_cost_measure: parseFloat(product.costperItem) || 0,
            self_through_rate: 0,
            created: product.created_on,
            first_sale: "",
            last_sale: "",
            last_received: product.updated_on,
            varient: product?.variant,
            instock: product?.instock,
            item_price: product?.item_price,
            reorder_level: product?.reorder_level
          }
        });
      };
      const mappedData = mapProductData(products);
      if (page == 0) {
        setProductListData(mappedData)
        
      }else {
        
        setProductListData(prev => [...prev, ...mappedData])
      }
      return products; 
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
       setLoading(false); 
    }
  }
  const fetchMoreData = () => {
    setPage(prevPage => prevPage + 1);
    fetchProductsData(page + 1);
  };


  useEffect(() => {
   
    fetchProductsData(page);
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
      />
       {/* )}  */}
    </>
  );
};


export default ReorderInventoryMain;
