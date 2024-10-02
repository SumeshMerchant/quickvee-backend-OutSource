import React, { useState, useEffect, lazy, Suspense } from "react";
import Grid from "@mui/system/Unstable_Grid/Grid";
import SelectDropDown from "../../../reuseableComponents/SelectDropDown";
import CurrentInventoryValue from "../../../Components/Reporting/CurrentInventoryValue/CurrentInventoryValue";
import NewItemCreatedBetweenMain from "../../../Components/Reporting/NewItemCreatedBetween/NewItemCreatedBetweenMain";
import ReorderInventory from "../../../Components/Reporting/ReorderInventory/ReorderInventoryMain";
import InstantActvity from "../../../Components/Reporting/InstantPo/InstantActvity";
import CheckIDVerify from "../../../Components/Reporting/CheckIDVerify/CheckIDVerifyMain";
import InventoryList from "../../../Components/Reporting/inventoryList/inventoryList";
import ProfitMarginReport from "../../../Components/Reporting/ProfitMarginReport/profitMarginReport";
import InventoryPerformanceMain from "../../../Components/Reporting/InventoryPerformance/InventoryPerformanceMain";
import RecentlyOutOfStockMain from "../../../Components/Reporting/InventoryOutOfStock/InventoryOutOfStockMain";
import SellThroughMain from "../../../Components/Reporting/InventorySellThrough/InventorySellThroughMain";
import InventorySummaryMain from "../../../Components/Reporting/InventorySummary/InventorySummaryMain";

import downloadIcon from "../../../Assests/Dashboard/download.svg";
import { useNavigate, useParams } from "react-router-dom";
import { CSVLink } from "react-csv";

const selectReportList = [
  {
    id: 81,
    title: "Current Inventory Value",
    url: "current-inventory-value",
  },
  {
    id: 73,
    title: "New Item Created Between",
    url: "item-create-between",
  },
  {
    id: 74,
    title: "Reorder Inventory",
    url: "recorder-inventory",
  },
  {
    id: 68,
    title: "Instant PO Activity Report",
    url: "instant-activity",
  },
  {
    id: 65,
    title: "Check ID verification",
    url: "id-verification",
  },
  {
    id: 93,
    title: "Inventory List",
    url: "inventory-list",
  },
  {
    id: 94,
    title: "Profit Margin Per Item Listing",
    url: "profit-margin-report",
  },
  {
    id: 95,
    title: "Performance",
    url: "inventory-performance",
  },
  {
    id: 96,
    title: "Recently out of Stock",
    url: "recently-out-of-stock",
  },
  {
    id: 97,
    title: "Sell through",
    url: "sell-through",
  },
];
const InventoryReportFilter = () => {
  const navigate = useNavigate();
  const { selectedReport } = useParams();
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [CSVData, setCSVData] = useState([]);
  const [CSVHeaders, setCSVHeader] = useState([]);
  const onDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const [selectedReportList, setSelectedReportList] = useState(
    "Current Inventory Value"
  );
  useEffect(() => {
    console.log("selectedReport: selectedReport", selectedReport);

    // If the selectedReport is undefined, push the "sales-summary" to the URL
    if (!selectedReport) {
      navigate("/store-reporting/current-inventory-value", {
        replace: true,
      });
    }
    console.log("selectedReport: ", selectedReport);
    setSelectedReportList(
      selectReportList.find((item) => item.url === selectedReport).title
    );
    setCSVData([]);
    setCSVHeader([]);
  }, [navigate]);

  const handleOptionClick = (option, dropdown) => {
    switch (dropdown) {
      case "reportList":
        setSelectedReportList(option.title);
        navigate(`/store-reporting/inventory-report/${option.url}`);
        break;

      default:
        break;
    }
  };

  const renderComponent = () => {
    switch (selectedReport) {
      case "current-inventory-value":
        return <CurrentInventoryValue hide={true} />;
      case "item-create-between":
        return <NewItemCreatedBetweenMain hide={true} />;
      case "recorder-inventory":
        return <ReorderInventory hide={true} />;
      case "instant-activity":
        return <InstantActvity hide={true} />;
      case "id-verification":
        return <CheckIDVerify hide={true} />;
      case "inventory-list":
        return <InventoryList hide={true} />;
      case "profit-margin-report":
        return <ProfitMarginReport hide={true} />;
      case "inventory-performance":
        return <InventoryPerformanceMain hide={true} />;
      case "recently-out-of-stock":
        return <RecentlyOutOfStockMain hide={true} />;
      case "sell-through":
        return <SellThroughMain hide={true} />;
      case "invantory-summary":
        return <InventorySummaryMain hide={true} />;
      default:
        break;
    }
  };

  return (
    <>
      <Grid container sx={{ padding: 2.5, mt: 3.6 }} className="box_shadow_div">
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item sx={{ display: "flex", gap: 2 }}>
              <h1
                style={{ marginBottom: 0 }}
                className="heading content-center whitespace-nowrap"
              >
                Inventory Report
              </h1>
              <SelectDropDown
                sx={{ pt: 0.5, width: "22.7rem" }}
                listItem={selectReportList}
                onClickHandler={handleOptionClick}
                selectedOption={selectedReportList}
                dropdownFor={"reportList"}
                title={"title"}
              />
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
            >
              <CSVLink data={CSVData} headers={CSVHeaders}>
                <div className="flex justify-center items-center flex-nowrap">
                  <h1 className="text-[#0A64F9] text-[16px]">Export report</h1>
                  <img
                    style={{ height: "30px", width: "30px" }}
                    src={downloadIcon}
                    alt="downloadIcon"
                  />
                </div>
              </CSVLink>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Suspense fallback={<div>loading... </div>}>
            {renderComponent()}
          </Suspense>
        </Grid>
      </Grid>
    </>
  );
};
export default InventoryReportFilter;
