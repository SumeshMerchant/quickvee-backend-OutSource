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
import sortIcon from "../../../Assests/Category/SortingW.svg";
import PasswordShow from "../../../Common/passwordShow";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
import TableFooter from "@mui/material/TableFooter";

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
  },
  "&:last-child td, &:last-child th": {},
  "& td, & th": {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 224, 224, 1)',
  },
}));

const CurrentInventoryValueList = ({productData}) => {
  const [allNewItemData, setallNewItemData] = useState(productData);

  const [sortOrder, setSortOrder] = useState("asc");
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
    setallNewItemData(productData);
  }, [productData]);

 
  
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
                          onClick={() => sortByItemName("string", "product")}
                        >
                          <p>Product</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => sortByItemName("num", "qoh")}
                        >
                          <p>GoH</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            onClick={() => sortByItemName("num", "cost")}
                          >
                            <p>Cost</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => sortByItemName("num", "totalValue")}
                        >
                          <p>Total Value</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      
                    </TableHead>
                    <TableBody>
                      {allNewItemData && allNewItemData?.length >= 1 ? (
                        allNewItemData?.map((employee, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              <p>{employee?.product}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>${employee?.qoh}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>${employee?.cost}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>${employee?.totalValue}</p>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        ""
                      )}
                    </TableBody>
                    <TableFooter className="table-footer">
                      <StyledTableRow>
                        <StyledTableCell>
                          <p >Totals</p>
                        </StyledTableCell>
                        <StyledTableCell>
                          <p>$90</p>
                        </StyledTableCell>
                        <StyledTableCell />
                        <StyledTableCell>
                          <p>{"$70.00"}</p>
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableFooter>
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

export default CurrentInventoryValueList;
