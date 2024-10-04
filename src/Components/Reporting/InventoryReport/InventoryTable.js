import React, { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import plusIcon from "../../../Assests/Products/plusIcon.svg";
import InventoryTableColumns from "./InventoryTableColumns";
import FirstButtonSelections from "./FirstButtonSelections";
import SecondButtonSelections from "./SecondButtonSelections";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from 'react-loading-skeleton';
const InventoryTable = ({ initialColumns, initialData, scrollForProduct, hasMore }) => {
  const [leftStickyOffset, setLeftStickyOffset] = useState(0);
  const [colWidths, setColWidths] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const tableRef = useRef(null);
  const [columns, setColumns] = useState(initialColumns);
  
  const [selectedColumns, setSelectedColumns] = useState({
    brand: false,
    vendor: false,
    category: false,
    revenue: false,
    gross_profit: false,
    sale_margin: false,
    customer_count: false,
    sale_count: false,
    inventory_cost:false,
    avg_items_per_sale: false,
    items_sold:false,
    sale_discounted:false,
    avg_sale_value: false,
    cost_goods_sold:false,
    retail_value:false,
    current_inventory:false,
    start_date_inventory:false,
    reorder_point:false,
    reorder_amount:false,
    return_count:false,
    inventory_days_cover:false,
    inventory_returns:false,
    inbound_inventory:false,
    items_sold_per_day: false,
    avgCostMeasure: false,
    selfThroughRate: false,
    created: false,
    firstSale: false,
    lastSale: false,
    last_received: false,
  });
  const updateColumns = () => {
    const updatedColumns = columns.filter((column) => !selectedColumns[column.id]);
    const updatedSelectedColumns = { ...selectedColumns };
    columns.forEach((column) => {
        if (selectedColumns.hasOwnProperty(column.id)) {
            updatedSelectedColumns[column.id] = true;
        }
    });
    setColumns(updatedColumns);
    setSelectedColumns(updatedSelectedColumns);
};
useEffect(() => {
  updateColumns();
}, []);
  const [popupCheckboxes, setPopupCheckboxes] = useState(""); // To track the active popup
  const [showColumnPopup, setShowColumnPopup] = useState(false);
  const [showMeasurePopup, setShowMeasurePopup] = useState(false);

  // Apply column selections for the first popup
  // Apply column selections for the first popup
  const applyColumns = () => {
    let updatedColumns = [...columns];
    const columnMappings = {
      brand: "brand",
      vendor: "vendor",
      category: "category",
    };

    Object.entries(columnMappings).forEach(([key, value]) => {
      if (selectedColumns[key] && !updatedColumns.some((col) => col.id === value)) {
        // Insert the new columns BEFORE the "plus_after_sku" column
        const index = updatedColumns.findIndex(col => col.id === "plus_after_sku");
        updatedColumns.splice(index, 0, { 
          id: value, 
          name: value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) 
      });
      } else if (!selectedColumns[key]) {
        updatedColumns = updatedColumns.filter((col) => col.id !== value);
      }
    });

    setColumns(updatedColumns);
    setShowColumnPopup(false);
  };

  // Apply measure selections for the second popup
  const applyMeasures = () => {
    let updatedColumns = [...columns];
    const measureMappings = {
      net_sale: "net_sale",
      gross_profit: "gross_profit",
      sale_margin: "sale_margin",
      customer_count: "customer_count",
      sale_count: "sale_count",
      items_sold_per_day: "items_sold_per_day",
      avg_items_per_sale: "avg_items_per_sale",
      items_sold:"items_sold",
      sale_discounted:"sale_discounted",
      avg_sale_value:"avg_sale_value",
      cost_goods_sold:"cost_goods_sold",
      retail_value:"retail_value",
      current_inventory:"current_inventory",
      start_date_inventory:"start_date_inventory",
      reorder_point:"reorder_point",
      reorder_amount:"reorder_amount",
      return_count:"return_count",
      inventory_days_cover:"inventory_days_cover",
      inventory_returns:"inventory_returns",
      inbound_inventory:"inbound_inventory",
      avgCostMeasure: "avg_cost_measure",
      inventory_cost:"inventory_cost",
      selfThroughRate: "self_through_rate",
      created: "created",
      firstSale: "first_sale",
      lastSale: "last_sale",
      last_received: "last_received",
    };

    Object.entries(measureMappings).forEach(([key, value]) => {
      if (selectedColumns[key] && !updatedColumns.some((col) => col.id === value)) {
        // Insert the new columns BEFORE the "plus_after_avg_cost" column
        const index = updatedColumns.findIndex(col => col.id === "plus_after_avg_cost");
        updatedColumns.splice(index, 0, { 
          id: value, 
          name: value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) 
      });
            } else if (!selectedColumns[key]) {
        updatedColumns = updatedColumns.filter((col) => col.id !== value);
      }
    });

    setColumns(updatedColumns);
    setShowMeasurePopup(false);
    setOpen(false);
  };

  
const renderLoader = () => {
  return (
    <table>
      <tbody>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
            <tr key={row} style={{background: 'rgba(0, 0, 0, 0.04)'}} >
              {["", "", "", "", "", "", "", "","",""].map((col) => (
                <td key={col}>
                  <Skeleton />
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};
 
  // Function to dynamically set the column widths
useEffect(() => {
  if (tableRef.current) {
    const headerCells = tableRef.current.querySelectorAll('thead th');
    const widths = Array.from(headerCells).map((th) => th.offsetWidth);
    setColWidths(widths);
  }
}, [columns, initialData]);
useEffect(() => {
  const tableContainer = document.querySelector(".custom-table");
  const tfootContainer = document.querySelector(".tfoot-scrollable-container");

  // Sync scroll between table and tfoot (from table to tfoot)
  const syncScrollFromTable = () => {
    tfootContainer.scrollLeft = tableContainer.scrollLeft;
  };

  // Sync scroll from tfoot to table (from footer to table)
  const syncScrollFromFooter = () => {
    tableContainer.scrollLeft = tfootContainer.scrollLeft;
  };

  // Add scroll event listeners
  tableContainer.addEventListener("scroll", syncScrollFromTable);
  tfootContainer.addEventListener("scroll", syncScrollFromFooter);

  // Cleanup event listeners on component unmount
  return () => {
    tableContainer.removeEventListener("scroll", syncScrollFromTable);
    tfootContainer.removeEventListener("scroll", syncScrollFromFooter);
  };
}, []);

//  console.log("========",initialData.length)
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <InfiniteScroll
            dataLength={initialData.length} // This is important to track the data length
            next={scrollForProduct} // This will trigger the parent's function to fetch more data
            hasMore={hasMore} // Parent will control if there's more data to fetch
            loader={<div className="custom-table">{renderLoader()}</div>}
          >
            <div className="custom-table custom-table-hidescroll">
              <table ref={tableRef}>
                <thead>
                  <tr>
                    {columns.map((col) => {
                      // Check if the column id matches to render the appropriate button
                      if (col.id === "plus_after_sku") {
                        return (
                          <th key={col.id} className="left-sticky">
                            <FirstButtonSelections
                              selectedColumns={selectedColumns}
                              setSelectedColumns={setSelectedColumns}
                              applyColumns={applyColumns}
                              setShowColumnPopup={setShowColumnPopup}
                            />
                          </th>
                        );
                      } else if (col.id === "plus_after_avg_cost") {
                        return (
                          <th key={col.id} className="right-sticky">
                            <div onClick={handleClickOpen}>
                              <img
                                style={{ height: "40px", width: "40px" }}
                                src={plusIcon}
                                alt="plusIcon"
                              />
                            </div>
                            <InventoryTableColumns
                              open={open}
                              handleClose={handleClose}
                              selectedColumns={selectedColumns}
                              setSelectedColumns={setSelectedColumns}
                              applyMeasures={applyMeasures}
                              setShowMeasurePopup={setShowMeasurePopup}
                            />
                          </th>
                        );
                      } else {
                        return <th key={col.id}>{col.name}</th>;
                      }
                    })}
                  </tr>
                </thead>
                <tbody>
                  {initialData.map((row, index) => (
                    <tr key={index}>
                      {columns.map((col) => (
                        <td key={col.id}>
                          {col.id === "sku" ? (
                            <>
                              <div>{row.name}</div>
                              <div style={{ fontSize: "0.9em", color: "gray" }}>
                                {row.sku == "revenue" ? `$ ${row.sku}` : row.sku}
                              </div>
                            </>
                          ) : col.id === "plus_after_sku" ||
                            col.id === "plus_after_avg_cost" ? (
                            "" // Display nothing for "plus_after_sku"
                          ) : row[col.id] !== null &&
                            row[col.id] !== undefined &&
                            row[col.id] !== "" ? (
                            row[col.id]
                          ) : (
                            "-" // Display "-" for other empty fields
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                
                  <tfoot>
                  <div className="tfoot-scrollable-container">
                  {/* {initialData.length > 0 && ( */}
                    <tr>
                      <td>
                        <div style={{ width: colWidths[0] - 3 }}>Totals</div>
                      </td>
                      {columns.slice(1).map((col, index) => (
                        <td key={col.id}>
                          <div style={{ width: colWidths[index + 1] }}>
                            {col.id === "closing_inventory"
                              ? "900"
                              : col.id === "sell_through_rate"
                              ? "90%"
                              : col.id === "inventory_cost"
                              ? "$72.00"
                              : col.id === "retail_value"
                              ? "600"
                              : col.id === "revenue"
                              ? "$600"
                              : col.id === "items_sold"
                              ? "600"
                              : col.id === "gross_profit"
                              ? "$600"
                              : col.id === "items_sold_per_day"
                              ? "600"
                              : col.id === "current_inventory"
                              ? "600"
                              : ""}
                          </div>
                        </td>
                      ))}
                      </tr>
                    {/* )} */}
                  </div>
                </tfoot>
              
                
              </table>

              {/* First popup (columns) */}
              {showColumnPopup && popupCheckboxes === "columns" && (
                <FirstButtonSelections
                  selectedColumns={selectedColumns}
                  setSelectedColumns={setSelectedColumns}
                  applyColumns={applyColumns}
                  setShowColumnPopup={setShowColumnPopup}
                />
              )}

              {/* Second popup (measures) */}
              {showMeasurePopup && popupCheckboxes === "measures" && (
                <SecondButtonSelections
                  selectedColumns={selectedColumns}
                  setSelectedColumns={setSelectedColumns}
                  applyMeasures={applyMeasures}
                  setShowMeasurePopup={setShowMeasurePopup}
                />
              )}
            </div>
          </InfiniteScroll>
        </Grid>
      </Grid>
        
    </>
  );
};

export default InventoryTable;