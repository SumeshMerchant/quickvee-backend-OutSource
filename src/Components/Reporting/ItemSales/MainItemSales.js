import React, { useState } from "react";
import ItemSalesFilter from "./ItemSalesFilter";

import NetSalesFilter from "./NetSalesFilter";
import ItemSalesDetails from "./ItemSalesDetails";
import DateRangeComponent from "../../../reuseableComponents/DateRangeComponent";
import useDebounce from "../../../hooks/useDebouncs";
import DashDateRangeComponent from "../../../reuseableComponents/DashDateRangeComponent";

const MainItemSales = ({ hide,setCSVData,setCSVHeader }) => {
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

  const handleFilterDataChange = (
    OrderSource,
    OrderType,
    SelectCat,
    searchItems
  ) => {
    setOrderSourceData(OrderSource);
    setOrderTypeData(OrderType);
    setSelectCatData(SelectCat);
    setItems(searchItems);
  };

  return (
    <>
      <ItemSalesFilter
        onFilterDataChange={handleFilterDataChange}
        setSearchRecord={setSearchRecord}
        debouncedValue={debouncedValue}
        hide={hide}
      />
      {!debouncedValue ? (
        
        hide ? (
          <DashDateRangeComponent onDateRangeChange={handleDateRangeChange} />
        ) : (
          <DateRangeComponent onDateRangeChange={handleDateRangeChange} />
        )
      ) : (
        ""
      )}

      <NetSalesFilter />

      <ItemSalesDetails
        selectedDateRange={selectedDateRange}
        OrderSourceData={OrderSourceData}
        OrderTypeData={OrderTypeData}
        SelectCatData={SelectCatData}
        items={debouncedValue}
        setCSVHeader={setCSVHeader}
        setCSVData={setCSVData}
      />
    </>
  );
};

export default MainItemSales;
