import React, { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import plusIcon from "../../../Assests/Products/plusIcon.svg";

import InventoryFilter from "./InventoryFilter";
import InventoryMeasures from "./InventoryMeasures";
import InventoryTableColumns from "./InventoryTableColumns";
import InventoryColumns from "./InventoryColumns";

import FirstButtonSelections from "./FirstButtonSelections";
import SecondButtonSelections from "./SecondButtonSelections";

const emails = ['username@gmail.com', 'user02@gmail.com'];

const QuantityHistoryReportTable = ({ initialColumns, initialData }) => {
    return (
        <>
            <Grid container className="box_shadow_div">
                <Grid item xs={12}>

                    <div className="custom-table">
                        <table className="doubale-header-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th colspan="2">Starting Qty</th>
                                    <th colspan="2">Ending Qty</th>
                                    <th colspan="2">Total Received</th>
                                    <th colspan="2">Total Returns</th>
                                    <th colspan="2">Total Sold</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                    <th>Qty</th>
                                    <th>Value</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>Product Name 1</td>
                                    <td>4</td>
                                    <td>$140.00</td>
                                    <td>4</td>
                                    <td>$0.00</td>
                                    <td>0</td>
                                    <td>$0.00</td>
                                    <td>0</td>
                                    <td>$0.00</td>
                                    <td>0</td>
                                    <td>$0.00</td>
                                </tr>
                                <tr>
                                    <td>Product Name 1</td>
                                    <td>2</td>
                                    <td>$10.00</td>
                                    <td>2</td>
                                    <td>$0.00</td>
                                    <td>0</td>
                                    <td>$0.00</td>
                                    <td>0</td>
                                    <td>$0.00</td>
                                    <td>0</td>
                                    <td>$0.00</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </Grid>
            </Grid>



        </>
    );
};

export default QuantityHistoryReportTable;