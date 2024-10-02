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

  const instantactivityDataState = [
    {
      "instant_po_info": {
        "title": "Product A 500ml",
        "variant": "Blueberry/5mg",
        "created_at": "Oct 1, 2024 03:21:53 AM"
      },
      "source": "OB",
      "before_adjust_qty": 2,
      "adjust_qty": -2,
      "after_adjust_qty": 0,
      "cost_per_item": 0,
      "total_cost": 12.99
    },
    {
      "instant_po_info": {
        "title": "Product B 200ml",
        "variant": "Strawberry/10mg",
        "created_at": "Sep 30, 2024 02:45:10 PM"
      },
      "source": "OB",
      "before_adjust_qty": 2,
      "adjust_qty": -2,
      "after_adjust_qty": 0,
      "cost_per_item": 0,
      "total_cost": 12.99
    },
    {
      "instant_po_info": {
        "title": "Product C 100ml",
        "variant": "Vanilla/3mg",
        "created_at": "Sep 30, 2024 11:10:23 AM"
      },
      "source": "Online",
      "before_adjust_qty": 2,
      "adjust_qty": -2,
      "after_adjust_qty": 0,
      "cost_per_item": 0,
      "total_cost": 12.99
    },
    {
      "instant_po_info": {
        "title": "Product D 250ml",
        "variant": "Mango/0mg",
        "created_at": "Sep 29, 2024 08:33:05 AM"
      },
      "source": "OB",
      "before_adjust_qty": 2,
      "adjust_qty": -2,
      "after_adjust_qty": 0,
      "cost_per_item": 0,
      "total_cost": 12.99
    },
    {
      "instant_po_info": {
        "title": "Product E 150ml",
        "variant": "Apple/5mg",
        "created_at": "Sep 28, 2024 06:22:45 PM"
      },
      "source": "Online",
      "before_adjust_qty": 2,
      "adjust_qty": -2,
      "after_adjust_qty": 0,
      "cost_per_item": 0,
      "total_cost": 12.99
    }
  ]
  
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
      <MainInstantDetails instantactivityDataState={instantactivityDataState}/>
      {/* <MainInstantDetails data={filteredData} /> */}
    </>
  );
};

export default InstantActvity;
