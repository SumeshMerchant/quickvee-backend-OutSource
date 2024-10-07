import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNewItemCreatedBetweenData } from "../../../Redux/features/Reports/NewItemCreatedBetweenSlice/NewItemCreatedBetweenSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import { priceFormate } from "../../../hooks/priceFormate";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import PasswordShow from "../../../Common/passwordShow";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
    fontFamily: "CircularSTDMedium !important",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDBook !important",
  },
  [`&.${tableCellClasses.table}`]: {
    fontSize: 14,
    fontFamily: "CircularSTDBook !important",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {},
  "& td, & th": {
    // border: "none",
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 224, 224, 1)',
  },
}));

const InventoryStocktateHistoryReportList = ({employeeData}) => {
  const [allNewItemData, setallNewItemData] = useState(employeeData);
  const SortTableItemsHelperFun = (items, type, name, sortOrder) => {
    const sortedItems = [...items].sort((a, b) => {
      if (type === "num") {
        const aValue = parseFloat(a[name]);
        const bValue = parseFloat(b[name]);
  
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      } else if (type === "string") {
        const aValue = a[name].toLowerCase();
        const bValue = b[name].toLowerCase();
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
      return 0;
    });
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
    return { sortedItems, newOrder };
  };
const [sortOrder, setSortOrder] = useState("asc");
const sortByItemName = (type, name) => {
  const { sortedItems, newOrder } = SortTableItemsHelperFun(
    allNewItemData,
    type,
    name,
    sortOrder
  );
  setallNewItemData(sortedItems);
  setSortOrder(newOrder);
};
useEffect(() => {
}, [allNewItemData]);

useEffect(() => {
  setallNewItemData(employeeData);
}, [employeeData]);
  return (
    <>
        <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              {/* {AllEmployeeListState.loading ? (
                <SkeletonTable
                  columns={[
                    "Stocktake",
                    "Status",
                    "Total Qty",
                    "Total Discrepancy Cost",
                    "Date",
                  ]}
                />
              ) : ( */}
                <TableContainer>
                  <StyledTable
                    sx={{ minWidth: 500 }}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => sortByItemName("string", "stocktake")}
                        >
                          <p>Stocktake</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => sortByItemName("string", "status")}
                        >
                          <p>Status</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            onClick={() => sortByItemName("num", "tqty")}
                          >
                            <p>Total Qty</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => sortByItemName("num", "tDiscrepancyCost")}
                        >
                          <p>Total Discrepancy Cost</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            // onClick={() => sortByItemName("num", "pin")}
                          >
                            <p>Date</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                    </TableHead>
                    <TableBody>
                      {allNewItemData && allNewItemData?.length >= 1 ? (
                        allNewItemData?.map((employee, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              <p className="text-[#0A64F9]">{employee?.stocktake}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>{employee?.status}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>{employee?.tqty}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>{employee?.tDiscrepancyCost}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                            <p>{employee?.Date}</p>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        ""
                      )}
                    </TableBody>
                  </StyledTable>
                  {/* {!employeeData?.length && <NoDataFound />} */}
                </TableContainer>
              {/* )} */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default InventoryStocktateHistoryReportList;
