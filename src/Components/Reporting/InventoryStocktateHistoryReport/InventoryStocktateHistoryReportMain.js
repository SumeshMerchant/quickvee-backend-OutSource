import React, { useState } from "react";
import InventoryStocktateHistoryReportList from "./InventoryStocktateHistoryReportList";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import { Grid } from "@mui/material";
// import InventoryTable from "../InventoryReport/InventoryTable";

const InventoryStocktateHistoryReportMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const employeeData = [
    {
      stocktake: "AT00001",
      status: "coid",
      tqty: 100,
      tDiscrepancyCost: 26.99,
      Date: "Sep 22, 2024"
    },
    {
      stocktake: "CT00001",
      status: "toid",
      tqty: 100,
      tDiscrepancyCost: 20.99,
      Date: "Sep 22, 2024"
    },
    {
      stocktake: "BT00001",
      status: "Void",
      tqty: 100,
      tDiscrepancyCost: 24.99,
      Date: "Sep 22, 2024"
    },
    {
      stocktake: "ST00001",
      status: "Void",
      tqty: 100,
      tDiscrepancyCost: 24.99,
      Date: "Sep 22, 2024"
    },
    {
      stocktake: "KT00001",
      status: "Void",
      tqty: 100,
      tDiscrepancyCost: 24.99,
      Date: "Sep 22, 2024"
    }
  ];
  

  return (
    <>
      <Grid container sx={{ padding: 0, mt: 3 }}>
        <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
      {/* <InventoryHistoryTable initialColumns={initialColumns} initialData={initialData}/> */}
      <InventoryStocktateHistoryReportList employeeData={employeeData}/>

    </>
  );
};

export default InventoryStocktateHistoryReportMain;
