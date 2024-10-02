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
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {},
  "& td, & th": {
    border: "none",
  },
}));

const NewItemCreatedBetweenList = ({allNewItemData}) => {
  const dispatch = useDispatch();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  const AllNewItemDataState = useSelector(
    (state) => state.NewItemCreatedBtnList
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(
      day,
      10
    )}, ${year}`;
  };
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
  
  };
  
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          {AllNewItemDataState.loading ||
          (AllNewItemDataState.status && !allNewItemData.length) ? (
            <SkeletonTable
              columns={["Date", "Category", "Item Name", "Price"]}
            />
          ) : (
            <TableContainer>
              <StyledTable sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      // onClick={() => sortByItemName("date", "created_on")}
                    >
                      <p className="whitespace-nowrap">Date</p>
                      <img src={sortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      // onClick={() => sortByItemName("str", "category")}
                    >
                      <p className="whitespace-nowrap">Category</p>
                      <img src={sortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      // onClick={() => sortByItemName("str", "item_name")}
                    >
                      <p className="whitespace-nowrap">Item Name</p>
                      <img src={sortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      // onClick={() => sortByItemName("num", "price")}
                    >
                      <p className="whitespace-nowrap">Price</p>
                      <img src={sortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                </TableHead>
                <TableBody>
                  {allNewItemData && allNewItemData.length >= 1
                    ? allNewItemData.map((ItemData, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell>
                            <p >
                              {ItemData.date}
                            </p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{ItemData.category}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{ItemData.item_name}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{ItemData.price}</p>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    : ""}
                </TableBody>
              </StyledTable>
              {!allNewItemData.length && <NoDataFound />}
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default NewItemCreatedBetweenList;
