import React, { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import plusIcon from "../../../Assests/Products/plusIcon.svg";
import InventoryTableColumns from "./InventoryTableColumns";
import FirstButtonSelections from "./FirstButtonSelections";
import SecondButtonSelections from "./SecondButtonSelections";
import InfiniteScroll from "react-infinite-scroll-component";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
import Skeleton from 'react-loading-skeleton';
const InventoryTable = ({ initialColumns, initialData, scrollForProduct, hasMore,loading,reportType }) => {
  const [leftStickyOffset, setLeftStickyOffset] = useState(0);
  const [colWidths, setColWidths] = useState([]);
  const [columns, setColumns] = useState(initialColumns);
  const [open, setOpen] = useState(false);

  const totalAvgCost = initialData.reduce((acc, item) => {
    if (item?.avg_cost !== undefined && item?.avg_cost !== null) {
      const cost = parseFloat(item.avg_cost);
      return acc + (isNaN(cost) ? 0 : cost);
    }
    return acc;
  }, 0);  

  const totalgross_profit = initialData.reduce((acc, item) => {
    if (item?.gross_profit !== undefined && item?.gross_profit !== null) {
      const cost = parseFloat(item.gross_profit);
      return acc + (isNaN(cost) ? 0 : cost);
    }
    return acc;
  }, 0); 
  const TotalItemsSoldPerDay = initialData.reduce((acc, item) => {
    if (item?.items_sold_per_day !== undefined && item?.items_sold_per_day !== null) {
      const cost = parseFloat(item?.items_sold_per_day);
      return acc + (isNaN(cost) ? 0 : cost);
    }
    return acc;
  }, 0);
  const Totalinventory_cost = initialData.reduce((acc, item) => {
    if (item?.inventory_cost !== undefined && item?.inventory_cost !== null) {
      const cost = parseFloat(item?.inventory_cost);
      return acc + (isNaN(cost) ? 0 : cost);
    }
    return acc;
  }, 0);
  const Totalitems_sold = initialData.reduce((acc, item) => {
    if (item?.times_sold !== undefined && item?.times_sold !== null) {
      const cost = parseFloat(item?.times_sold);
      return acc + (isNaN(cost) ? 0 : cost);
    }
    return acc;
  }, 0);

  const Totalrevenue = initialData.reduce((acc, item) => {
    if (item?.revenue !== undefined && item?.revenue !== null) {
      const cost = parseFloat(item?.revenue);
      return acc + (isNaN(cost) ? 0 : cost);
    }
    return acc;
  }, 0);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const tableRef = useRef(null);
  
  const [columnsOptions, setcolumnsOptions] = useState(reportType||[]);

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
    avg_cost: false,
    selfThroughRate: false,
    created: false,
    firstSale: false,
    lastSale: false,
    last_received: false,
    tag:false
  });
  useEffect(() => {
    const updatedColumns = { ...selectedColumns };
     const firstColumnId = initialColumns[0].id;
      updatedColumns[firstColumnId] = true;
      setSelectedColumns(updatedColumns);
  }, [selectedColumns]);
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
useEffect(() => {
  setColumns(initialColumns);
}, [initialColumns]);
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
      tag: "tag",
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
      avg_cost: "avg_cost",
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


useEffect(()=>{
setcolumnsOptions(reportType)
},[columnsOptions,reportType])
useEffect(() => {
  const tableContainer = document.querySelector(".custom-table");
  const tfootContainer = document.querySelector(".tfoot-scrollable-container");

  // Sync scroll between table and tfoot (from table to tfoot)
  const syncScrollFromTable = () => {
    if(tableContainer){
      tfootContainer.scrollLeft = tableContainer.scrollLeft;
    }
  };

  // Sync scroll from tfoot to table (from footer to table)
  const syncScrollFromFooter = () => {
    if(tableContainer){
      tableContainer.scrollLeft = tfootContainer.scrollLeft;
    }
  };

  // Add scroll event listeners
  if(tableContainer && tfootContainer){
    tableContainer.addEventListener("scroll", syncScrollFromTable);
    tfootContainer.addEventListener("scroll", syncScrollFromFooter);
  }

  // Cleanup event listeners on component unmount
  return () => {
    if(tableContainer){
    tableContainer.removeEventListener("scroll", syncScrollFromTable);
    }
    if(tfootContainer){
      tfootContainer.removeEventListener("scroll", syncScrollFromFooter);
    }
  };

}, []);

  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
        {loading ? (
            <div className="custom-table">{renderLoader()}</div>
          ) : initialData?.length === 0 ? (
            <NoDataFound message="No Data Found" />
          ) : (
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
                              columnsOptions={columnsOptions}
                              selectedColumns={selectedColumns}
                              setSelectedColumns={setSelectedColumns}
                              applyColumns={applyColumns}
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
                            "" // Display nothing for "plus_after_sku" sell_through_rate
                          ): row[col.id] !== null &&  (col.id === "avg_cost" || col.id === "gross_profit" ||col.id === "revenue" ||col.id === "inventory_cost") && row[col.id] !== undefined && row[col.id] !== "" ? (
                            isNaN(parseFloat(row[col.id])) ? '-' : `$ ${parseFloat(row[col.id]).toFixed(2)}`
                        ): row[col.id] !== null && ( col.id === "sell_through_rate" || col.id === "avg_discount_percentage") && row[col.id] !== undefined && row[col.id] !== "" ? (
                          isNaN(parseFloat(row[col.id])) ? '-' : `${parseFloat(row[col.id]).toFixed(2)} % `
                      ): row[col.id] !== null &&  (col.id === "net_sale" || col.id === "sale_margin" || col.id ==="avg_items_per_sale" || col.id ==="avg_sale_value" || col.id ==="cost_goods_sold") && row[col.id] !== undefined && row[col.id] !== "" ? (
                        isNaN(parseFloat(row[col.id])) ? '-' :  ` ${parseFloat(row[col.id]).toFixed(2)}`
                    ): row[col.id] !== null &&  col.id === "name" && row[col.id] !== undefined && row[col.id] !== "" ? (
                      row[col.id] ? row[col.id].charAt(0).toUpperCase() + row[col.id].slice(1).toLowerCase() : '-'
                  ): row[col.id] !== null &&
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
                  {initialData && initialData.length > 0 && (
                    <tr>
                      <td>
                        <div style={{ width: colWidths[0] - 3 }}>Totals</div>
                      </td>
                      {columns.slice(1).map((col, index) => (
                        <td key={col.id}>
                          <div style={{ width: colWidths[index + 1] }}>
                            {col.id === "avg_cost"
                              ?  `$ ${parseFloat(totalAvgCost).toFixed(2)}`
                              : col.id === "sell_through_rate"
                              ? "90%"
                              : col.id === "inventory_cost"
                              ?  `$ ${parseFloat(Totalinventory_cost).toFixed(2)}`  
                              : col.id === "retail_value"
                              ? "600"
                              : col.id === "revenue"
                              ? `$ ${parseFloat(Totalrevenue).toFixed(2)}`
                              : col.id === "times_sold"
                              ? ` ${parseFloat(Totalitems_sold).toFixed(2)}` 
                              : col.id === "gross_profit"
                              ?  `$ ${parseFloat(totalgross_profit).toFixed(2)}`
                              : col.id === "items_sold_per_day"
                              ? `${parseFloat(TotalItemsSoldPerDay).toFixed(2)}`
                              : col.id === "current_inventory"
                              ? "600"
                              : ""}
                          </div>
                        </td>
                      ))}
                      </tr>
                    )}
                  </div>
                </tfoot>
              
                
              </table>

              {/* First popup (columns) */}
              {showColumnPopup && popupCheckboxes === "columns" && (
                <FirstButtonSelections
                columnsOptions={columnsOptions}
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
           )}
        </Grid>
      </Grid>
        
    </>
  );
};

export default InventoryTable;