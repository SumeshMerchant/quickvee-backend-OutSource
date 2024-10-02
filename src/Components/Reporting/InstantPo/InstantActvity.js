import React, { useState } from "react";

import MainInstantDetails from "./MainInstantDetails";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import DateRangeComponent from "../../../reuseableComponents/DateRangeComponent";
import { Grid } from "@mui/material";
import InventoryTable from "../InventoryReport/InventoryTable";

const InstantActvity = ({ hide = false }) => {
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();

  const [filteredData, setFilteredData] = useState([]);
  const handleDataFiltered = (data) => {
    let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
    const updatedData = {
      ...data,
      merchant_id,
      ...userTypeData,
    };
    setFilteredData(updatedData);
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
                Instant PO Activity Report
              </h1>
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
      <Grid container sx={{ padding: 2.5, mt: 3.6 }}>
        <Grid item xs={12}>
          <DateRangeComponent onDateRangeChange={handleDataFiltered} />
        </Grid>
      </Grid>
      <InventoryTable />
      {/* <MainInstantDetails data={filteredData} /> */}
    </>
  );
};

export default InstantActvity;
