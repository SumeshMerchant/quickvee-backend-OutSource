import React, { useState } from "react";
import InventoryReportFilter from "./InventoryReportFilter";

import NetSalesFilter from "./NetSalesFilter";
import InventoryTable from "./InventoryTable";
import DateRangeComponent from "../../../reuseableComponents/DateRangeComponent";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";
import useDebounce from "../../../hooks/useDebouncs";
import "../../../Styles/Reports.scss";
import plusIcon from "../../../Assests/Products/plusIcon.svg";

const MainItemSales = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [OrderSourceData, setOrderSourceData] = useState(null);
  const [OrderTypeData, setOrderTypeData] = useState(null);
  const [SelectCatData, setSelectCatData] = useState(null);
  const [items, setItems] = useState("");

  const [searchRecord, setSearchRecord] = useState("");
  const debouncedValue = useDebounce(searchRecord, 500);

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const handleFilterDataChange = (OrderSource, OrderType, SelectCat,searchItems) => {
    setOrderSourceData(OrderSource);
    setOrderTypeData(OrderType);
    setSelectCatData(SelectCat);
    setItems(searchItems)
  };

  
  return (
    <>
      <div>
        <InventoryReportFilter
          onFilterDataChange={handleFilterDataChange}
          setSearchRecord={setSearchRecord}
          debouncedValue={debouncedValue}
        />
        {/* { !debouncedValue ? ( <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />):("")}
         */}
        {/* <NetSalesFilter /> */}
      </div>
    </>
  );
};

export default MainItemSales;
