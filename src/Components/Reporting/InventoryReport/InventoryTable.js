import React, { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import plusIcon from "../../../Assests/Products/plusIcon.svg";
import InventoryFilter from "./InventoryFilter";
import InventoryMeasures from "./InventoryMeasures";
import InventoryTableColumns from "./InventoryTableColumns";
import InventoryColumns from "./InventoryColumns";
import FirstButtonSelections from "./FirstButtonSelections";
import SecondButtonSelections from "./SecondButtonSelections";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from 'react-loading-skeleton';

const emails = ['username@gmail.com', 'user02@gmail.com'];

const InventoryTable = ({ initialColumns, initialData, scrollForProduct, hasMore }) => {

  const [leftStickyOffset, setLeftStickyOffset] = useState(0);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const tableRef = useRef(null);

  // useEffect(() => {
  //   // setData(initialData);
  //   if (tableRef.current) {
  //     const tableHeaders = tableRef.current.querySelectorAll("th");
  //     let offset = 0;
 
  //     // Calculate cumulative width of all <th> before the left-sticky class
  //     for (let i = 0; i < tableHeaders.length; i++) {
  //       const th = tableHeaders[i];
  //       if (th.classList.contains("left-sticky")) {
  //         break;
  //       }
  //       offset += th.offsetWidth;
  //     }

  //     // Set the left offset for the sticky header
  //     setLeftStickyOffset(offset);
  //   }

  // }, []);

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
    lastReceived: false,
  });

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
        updatedColumns.splice(index, 0, { id: value, name: value.replace(/_/g, ' ').toUpperCase() });
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
      lastReceived: "last_received",
    };

    Object.entries(measureMappings).forEach(([key, value]) => {
      if (selectedColumns[key] && !updatedColumns.some((col) => col.id === value)) {
        // Insert the new columns BEFORE the "plus_after_avg_cost" column
        const index = updatedColumns.findIndex(col => col.id === "plus_after_avg_cost");
        updatedColumns.splice(index, 0, { id: value, name: value.replace(/_/g, ' ').toUpperCase() });
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
 
 
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
        <InfiniteScroll
              dataLength={initialData.length} // This is important to track the data length
              next={scrollForProduct} // This will trigger the parent's function to fetch more data
              hasMore={hasMore} // Parent will control if there's more data to fetch
              loader={
                <div className="custom-table">{renderLoader()}</div>
              }
              // endMessage={
              //   <p style={{ textAlign: "center" }}>
              //     <b>Yay! You have seen it all</b>
              //   </p>
              // }
            >
          <div className="custom-table">
          <table>
            <thead>

              <tr>
              {columns.map((col) => {
                  // Check if the column id matches to render the appropriate button
                  if (col.id === "plus_after_sku") {
                    return (
                      <th key={col.id} className="left-sticky">
                        {/* <button onClick={() => { setShowColumnPopup(true); setPopupCheckboxes("columns"); }}>
                          
                        </button> */}
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
                        {/* <button onClick={() => { setShowMeasurePopup(true); setPopupCheckboxes("measures"); }}>
                          
                        </button> */}

                      <div onClick={handleClickOpen}>
                          <img
                            style={{ height: "40px", width: "40px" }}
                            src={plusIcon}
                            alt="plusIcon"
                          />
                        </div>
                        <InventoryTableColumns open={open} handleClose={handleClose} 
                          selectedColumns={selectedColumns}
                          setSelectedColumns={setSelectedColumns}
                          applyMeasures={applyMeasures}
                          setShowMeasurePopup={setShowMeasurePopup}
                        />
                      </th>
                    );
                  } else {
                    return (
                      <th key={col.id}>
                        {col.name}
                      </th>
                    );
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
          ) : col.id === "plus_after_sku" || col.id === "plus_after_avg_cost" ? (
            "" // Display nothing for "plus_after_sku"
          ) : row[col.id] !== null && row[col.id] !== undefined && row[col.id] !== "" ? (
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
                <tr>
                  <td>Totals</td>  
                  {columns.slice(1).map((col) => {
    if (col.id === "closing_inventory") {
      return <td key={col.id}>900</td>;
    } else if (col.id === "sell_through_rate") {
      return <td key={col.id}>90%</td>;
    } else if (col.id === "inventory_cost") {
      return <td key={col.id}>$72.00</td>;
    } else if (col.id === "retail_value") {
      return <td key={col.id}>600</td>;
    } else if (col.id === "revenue") { 
      return <td key={col.id}>$600</td>;
    }
    else if (col.id === "items_sold") { 
      return <td key={col.id}>600</td>;
    }
    else if (col.id === "gross_profit") { 
      return <td key={col.id}>$600</td>;
    }
    else if (col.id === "items_sold_per_day") {
      return <td key={col.id}>600</td>;
    }
    else if (col.id === "current_inventory") {
      return <td key={col.id}>600</td>;
    }
    else {
      return <td key={col.id}></td>;
    }
  })}
                </tr>
              </tfoot>

            {/* <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col.id}>
                      {row[col.id] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody> */}
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