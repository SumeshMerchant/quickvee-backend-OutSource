import React, { useState } from "react";
import NewItemCreatedBetweenList from "./NewItemCreatedBetweenList";
import DateRangeComponent from "../../../reuseableComponents/DateRangeComponent";
import { Grid } from "@mui/material";
import InventoryTable from "../InventoryReport/InventoryTable";
const NewItemCreatedBetweenMain = ({ hide = false }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  return (
    <>
      {/* <Grid
        container
        sx={{ padding: 2.5, mt: 3.6 }}
        className="box_shadow_div "
      >
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <h1 style={{ marginBottom: 0 }} className="heading ">
                New Item Created Between Report
              </h1>
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
      <Grid container sx={{ mt: 3.6 }}>
        <DateRangeComponent onDateRangeChange={handleDateRangeChange} />
      </Grid>
      <InventoryTable />
      {/* already have data   
      <NewItemCreatedBetweenList selectedDateRange={selectedDateRange} />
      */}
    </>
  );
};

export default NewItemCreatedBetweenMain;
