import React, { useEffect, useState } from "react";
import "../../../Styles/EmployeeWorking.css";
import { fetchinstantactivityData } from "../../../Redux/features/InstantActivity/instantactivitySlice";
import { useSelector, useDispatch } from "react-redux";

import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priceFormate } from "../../../hooks/priceFormate";
// import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import PasswordShow from "../../../Common/passwordShow";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
import useDelayedNodata from "../../../hooks/useDelayedNoData";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
    fontFamily: "CircularSTDMedium",
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

const MainInstantDetails = ({ instantactivityDataState }) => {
  const dispatch = useDispatch();
  const [instantactivity, setinstantactivity] = useState(instantactivityDataState);
  // const showNoData = useDelayedNodata(instantactivityDataState)
  // const instantactivityDataState = useSelector(
  //   (state) => state.instantactivity
  // );
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
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
      instantactivity,
      type,
      name,
      sortOrder
    );
    setinstantactivity(sortedItems);
    setSortOrder(newOrder);
  };
  useEffect(() => {
  }, [instantactivity]);
  
  useEffect(() => {
    setinstantactivity(instantactivityDataState);
  }, [instantactivityDataState]);
  
  
  return (
    <>
      <Grid container className="box_shadow_div">
      <Grid container>
        <Grid item xs={12}>

            <>
              <TableContainer>
                <StyledTable
                  sx={{ minWidth: 500 }}
                  aria-label="customized table"
                >
                  <TableHead>
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("str", "title")}
                      >
                        <p>Instant PO Info</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>

                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("str", "source")}
                      >
                        <p>Source</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>

                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "before_adjust_qty")}
                      >
                        <p>Before Adjust Qty</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "adjust_qty")}
                      >
                        <p>Adjust Qty</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "after_adjust_qty")}
                      >
                        <p>After Adjust Qty</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "cost_per_item")}
                      >
                        <p>Per Item Cost</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName("num", "total_cost")}
                      >
                        <p>Total Cost</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {instantactivity && instantactivity.length >= 1
                      ? instantactivity.map((instantactivity, index) => {
      
                          return (
                            <StyledTableRow key={index}>
                              <StyledTableCell>
                                <div>
                                  <p>{instantactivity.instant_po_info.title}</p>
                                  <p
                                    className="text-[#0A64F9]"
                                    
                                  >
                                    {instantactivity.instant_po_info.variant}
                                  </p>
                                  <div className="flex ">
                                    <p
                                      className="text-[#818181] me-3"
                                      style={{
                                        color: "#818181",
                                      }}
                                      
                                    >
                                      {
                                        instantactivity.instant_po_info.created_at
                                      }
                                    </p>
                                    {/* <p
                                      style={{
                                        color: "#818181",
                                      }}
                                    >
                                      {new Date(
                                        instantactivity.created_at
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      })}
                                    </p> */}
                                  </div>
                                </div>
                              </StyledTableCell>

                              <StyledTableCell>
                                <p>
                                  { instantactivity.source}
                                </p>
                              </StyledTableCell>

                              <StyledTableCell>
                                <p>
                                  {instantactivity.before_adjust_qty}
                                </p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>{instantactivity.adjust_qty}</p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>
                                  {instantactivity.after_adjust_qty }
                                </p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>{instantactivity.cost_per_item}</p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>
                                {instantactivity.total_cost ? `$${instantactivity.total_cost.toFixed(2)}` : ''}
                                </p>
                              </StyledTableCell>
                            </StyledTableRow>
                          );
                        })
                      : ""}
                  </TableBody>
                </StyledTable>
                {instantactivity && !instantactivity.length && <NoDataFound />}
              </TableContainer>
            </>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MainInstantDetails;
