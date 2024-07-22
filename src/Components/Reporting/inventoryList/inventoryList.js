import React from "react";
import { Grid } from "@mui/material";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import BasicTextFields from "../../../reuseableComponents/TextInputField";
import InventoryLogic from "./InventoryLogic";
import Pagination from "./pagination";
import CustomHeader from "../../../reuseableComponents/CustomHeader";
export default function InventoryList() {
  const {
    handleChangeInventory,
    inventory,

    category,
    handleOptionClick,
    selectedCategory,
    message,
    searchProduct,
    handleLoadMore,
    laodMoreData,
    loader,
    sortByItemName,
    endOfDataList,
  } = InventoryLogic();
  return (
    <>
      <Grid container className="box_shadow_div">
        <CustomHeader>Inventory List Report</CustomHeader>
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ px: 2.5, py: 2.5 }}>
            <Grid item xs={12} sm={6} md={4}>
              <label
                className="q-details-page-label"
                htmlFor="orderSourceFilter"
              >
                Search Product
              </label>

              
              

              <BasicTextFields
                sx={{ pt: 0.5 }}
                type={"text"}
                name="product"
                value={inventory}
                placeholder="Search Product"
                onChangeFun={handleChangeInventory}
                required={"required"}
                
              />
            </Grid>
            
            









            
            <Grid item xs={12} sm={6} md={4}>
              <label className="q-details-page-label" htmlFor="limitFilter">
                Category
              </label>
              <SelectDropDown
                sx={{ pt: 0.5 }}
                heading={"All"}
                listItem={category}
                title={"title"}
                dropdownFor={"category"}
                selectedOption={selectedCategory}
                onClickHandler={handleOptionClick}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Pagination
            searchProduct={searchProduct}
            message={message}
            handleLoadMore={handleLoadMore}
            laodMoreData={laodMoreData}
            loader={loader}
            sortByItemName={sortByItemName}
            endOfDataList={endOfDataList}
          />
        </Grid>
      </Grid>
    </>
  );
}
