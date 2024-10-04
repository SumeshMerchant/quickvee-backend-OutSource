import React, { useState,useEffect } from "react";

import MainInstantDetails from "./MainInstantDetails";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import DateRangeComponent from "../../../reuseableComponents/DateRangeComponent";
import { Grid } from "@mui/material";
import InventoryTable from "../InventoryReport/InventoryTable";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import Config from "../../../Constants/Config";
import axios from 'axios';

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const InstantActvity = ({ hide = false }) => {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // Track current page number
    const [poActivityListData, setPoActivityListData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  const [filteredData, setFilteredData] = useState({
    start_date: getCurrentDate(),
    end_date: getCurrentDate(), 
  });
  const handleDataFiltered = (data) => {
    const updatedData = {
      ...data
    };
    setFilteredData(updatedData);
    fetchProductsData(page);
  };

  const fetchProductsData = async (currentPage) => {

    try {
      setLoading(true)
      const payload = {
        merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
        token_id: LoginGetDashBoardRecordJson?.token_id,
        login_type: LoginGetDashBoardRecordJson?.login_type,
        limit: 10,
        offset: (currentPage - 1) * 10, 
        ...filteredData,  
      }
      console.log("=-=-=payload",payload)
      const response = await axios.post(
        `${Config.BASE_URL}${Config.INSTANT_ACTIVITY_REPORT}`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `${LoginGetDashBoardRecordJson?.token}`
          },
        }
      );

      const products = response?.data?.result;
      console.log("=-=-=-products",products)

      if (products && products.length < 10) {
        setHasMore(false);
      }
      const transformData = (resultData) => {
        return resultData.map(item => ({
          instant_po_info: {
            title: item.title || `Product ${item.product_id}`, 
            variant: item.variant || `Variant ${item.variant_id}`,
            created_at: new Date(item.created_at).toLocaleString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
              hour12: true
            })
          },
          source: "OB" , 
          before_adjust_qty: parseInt(item.current_qty) || 0,
          adjust_qty: parseInt(item.qty) || 0,
          after_adjust_qty: parseInt(item.after_qty) || 0,
          cost_per_item: parseFloat(item.price) || 0,
          total_cost: parseFloat(item.price) * parseInt(item.qty) || 0
        }));
      };
      if(products != undefined && products != ""){
        const instantactivityDataState = transformData(products);
          setPoActivityListData(instantactivityDataState)
      } else {
        setPoActivityListData([])
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
      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <DashDateRangeComponent onDateRangeChange={handleDataFiltered} />
        </Grid>
      </Grid>
      <MainInstantDetails instantactivityDataState={poActivityListData}  scrollForProduct={fetchMoreData}
        hasMore={hasMore}/>
    </>
  );
};

export default InstantActvity;
