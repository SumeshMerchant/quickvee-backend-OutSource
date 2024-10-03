import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { priceFormate } from "../../../hooks/priceFormate";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import Skeleton from "react-loading-skeleton";
import { Grid } from "@mui/material";
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
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {},
  "& td, & th": {
    border: "none",
  },
}));
export default function Pagination(props) {
  const showNoData = useDelayedNodata(props.searchProduct);
  let columns = ["Product Name", "Category", "Quantity", "Cost Per Item ","Price","Margin","Profit"];
  const renderLoader = () => {
    return (
      <TableContainer>
        <StyledTable aria-label="customized table">
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
              <StyledTableRow key={row}>
                {["", "", "", ""].map((col) => (
                  <StyledTableCell key={col}>
                    <Skeleton />
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    );
  };
  return (
    <>
      {props.loader ? (
        <>
          <SkeletonTable columns={columns} />
        </>
      ) : (
        <>
          <TableContainer>
            <StyledTable            
                     sx={{ minWidth: 500 }}
                    aria-label="customized table">
            <TableHead>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => props.sortByItemName("str", "title")}
                        >
                          <p>Product Name</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => props.sortByItemName("str", "category_name")}
                        >
                          <p>Category</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            onClick={() => props.sortByItemName("num", "quantity")}
                          >
                            <p>Quantity</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          onClick={() => props.sortByItemName("num", "costperItem")}
                        >
                          <p>Cost Per Item</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            onClick={() => props.sortByItemName("num", "price")}
                          >
                            <p>Price</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            onClick={() => props.sortByItemName("num", "margin")}
                          >
                            <p>Margin</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            onClick={() => props.sortByItemName("num", "profit")}
                          >
                            <p>Profit</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                    </TableHead>
              <TableBody>
                {props.searchProduct.length > 0
                  ? props.searchProduct?.map((employee, index) => (
                    <StyledTableRow key={index}>
                    <StyledTableCell>
                      <p >{employee?.title}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                      <p>{employee?.category_name}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                      <p>{employee?.quantity}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                    <p>{employee?.costperItem ? `$${employee.costperItem}` : ''}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                    <p>{employee?.price ? `$${employee?.price}` : ''}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                    <p>{employee?.margin}</p>
                    </StyledTableCell>
                    <StyledTableCell>
                    <p>{employee?.profit ? `$${employee?.profit}` : ''}</p>
                    </StyledTableCell>
                  </StyledTableRow>
                    ))
                  : ""}
              </TableBody>
            </StyledTable>
          </TableContainer>
          {props.searchProduct.length ? (
            props.laodMoreData ? (
              renderLoader()
            ) : !props.endOfDataList ? (
              <Stack spacing={2} direction="row">
                <Button
                  sx={{ fontFamily: "CircularMedium" }}
                  variant="outlined"
                  className="button-load"
                  onClick={props.handleLoadMore}
                >
                  Load More
                </Button>
              </Stack>
            ) : (
              ""
            )
          ) : (
            showNoData && <NoDataFound />
          )}
        </>
      )}
    </>
  );
}
