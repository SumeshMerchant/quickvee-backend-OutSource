import React, { useEffect, useState } from "react";
import { fetchcurrentInventoryreportData } from "../../../Redux/features/CurrentInventoryValue/currentInventoryValueSlice";
import { useSelector, useDispatch } from "react-redux";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { Grid } from "@mui/material";
import { priceFormate } from "../../../hooks/priceFormate";
import Skeleton from "react-loading-skeleton";
import PasswordShow from "../../../Common/passwordShow";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import InventoryTable from "../InventoryReport/InventoryTable";
import CurrentInventoryValueList from "./CurrentInventoryValueList";

const CurrentInventoryValue = ({ hide = false }) => {
  console.log("sadadasdassss");
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [currentInventory, setcurrentInventory] = useState([]);
  const currentInventoryreportDataState = useSelector(
    (state) => state.currentInventoryreport
  );
  const dispatch = useDispatch();
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = {
          merchant_id,
          ...userTypeData,
        };
        if (data) {
          await dispatch(fetchcurrentInventoryreportData(data)).unwrap();
        }
      } catch (error) {
        if (
          error.status == 401
          // || error.response.status === 401
        ) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status == "Network Error") {
          getNetworkError();
        }
      }
    };

    // fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (
      !currentInventoryreportDataState.loading &&
      currentInventoryreportDataState.currentInventoryreportData
    ) {
      setcurrentInventory(
        currentInventoryreportDataState.currentInventoryreportData
      );
    }
  }, [
    currentInventoryreportDataState.loading,
    currentInventoryreportDataState.currentInventoryreportData,
  ]);

  const formatNumber = (value) => {
    const floatValue = parseFloat(value);
    const formattedValue = floatValue.toFixed(2);
    return floatValue % 1 === 0
      ? String(parseFloat(floatValue))
      : formattedValue;
  };

  const productData = [
    {
      product: "Product Name 1",
      qoh: 4,
      cost: "$5.00",
      totalValue: "$20.00"
    },
    {
      product: "Product Name 1",
      qoh: 2,
      cost: "$5.00",
      totalValue: "$10.00"
    },
    {
      product: "Product Name 1",
      qoh: 2,
      cost: "$5.00",
      totalValue: "$10.00"
    },
    {
      product: "Product Name 1",
      qoh: 2,
      cost: "$5.00",
      totalValue: "$10.00"
    },
    {
      product: "Product Name 1",
      qoh: 2,
      cost: "$5.00",
      totalValue: "$10.00"
    },
    {
      product: "Product Name 1",
      qoh: 2,
      cost: "$5.00",
      totalValue: "$10.00"
    }
  ];

  return (
    <>
      <Grid container sx={{ padding: 0, mt: 3.6 }}>
        <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
      <CurrentInventoryValueList productData={productData}/>                                                                                        

      {/* already dynamic */}
      {/* <Grid container className="box_shadow_div"></Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <div className="bg-white p-4 shadow-md rounded-lg opacity-100  h-30">
            <div className="font-normal  tracking-normal Admin_std">
              Total Number of Items
            </div>
            <div className="text-[20px] font-bold mt-4 common-font-bold">
              {currentInventory.final_quantity ? (
                priceFormate(formatNumber(currentInventory.final_quantity))
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <div className="bg-white p-4 shadow-md rounded-lg opacity-100  h-30">
            <div className="font-normal  tracking-normal Admin_std">
              Total Retail Value
            </div>
            <div className="text-[20px] font-bold mt-4 common-font-bold">
              {currentInventory.total_sale_price ? (
                "$" +
                priceFormate(formatNumber(currentInventory.total_sale_price))
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <div className="bg-white p-4 shadow-md rounded-lg opacity-100  h-30">
            <div className="font-normal  tracking-normal Admin_std">
              Total Inventory Cost
            </div>
            <div className="text-[20px] font-bold mt-4 common-font-bold">
              {currentInventory.total_cpi_price ? (
                "$" +
                priceFormate(formatNumber(currentInventory.total_cpi_price))
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </Grid>
      </Grid> */}
    </>
  );
};

export default CurrentInventoryValue;
