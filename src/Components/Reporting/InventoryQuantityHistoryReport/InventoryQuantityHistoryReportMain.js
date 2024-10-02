import React, { useState } from "react";
import InventoryQuantityHistoryReportList from "./InventoryQuantityHistoryReportList";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import { Grid } from "@mui/material";

const InventoryQuantityHistoryReportMain = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  return (
    <>
      <Grid container sx={{ padding: 2.5, mt: 3.6 }}>
        <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
    </>
  );
};

export default InventoryQuantityHistoryReportMain;
