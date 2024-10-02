import React, { useState } from "react";
import NewItemCreatedBetweenList from "./NewItemCreatedBetweenList";
import DateRangeComponent from "../../../reuseableComponents/DateRangeComponent";
import { Grid } from "@mui/material";

const NewItemCreatedBetweenMain = ({ hide = false }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const allNewItemData = [
    {
      "date": "October 1, 2024",
      "category": "Electronics",
      "item_name": "Wireless Headphones",
      "price": "$59.99"
    },
    {
      "date": "October 1, 2024",
      "category": "Books",
      "item_name": "JavaScript Guide",
      "price": "$25.99"
    },
    {
      "date": "September 30, 2024",
      "category": "Groceries",
      "item_name": "Organic Apples",
      "price": "$4.99"
    },
    {
      "date": "September 30, 2024",
      "category": "Home",
      "item_name": "LED Light Bulbs",
      "price": "$15.00"
    },
    {
      "date": "September 29, 2024",
      "category": "Fitness",
      "item_name": "Yoga Mat",
      "price": "$30.00"
    }
  ];
  

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
      <NewItemCreatedBetweenList allNewItemData={allNewItemData}/>
      {/* already have data   
      <NewItemCreatedBetweenList selectedDateRange={selectedDateRange} />
      */}
    </>
  );
};

export default NewItemCreatedBetweenMain;
