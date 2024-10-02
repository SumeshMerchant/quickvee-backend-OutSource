import React, { useState } from "react";
import InventoryQuantityHistoryReportList from "./InventoryQuantityHistoryReportList";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import { Grid } from "@mui/material";
import InventoryTable from "../InventoryReport/InventoryTable";

const InventoryQuantityHistoryReportMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  return (
    <>
      <Grid container sx={{ mt: 3.6 }}>
        <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
      <InventoryTable />
    </>
  );
};

export default InventoryQuantityHistoryReportMain;
