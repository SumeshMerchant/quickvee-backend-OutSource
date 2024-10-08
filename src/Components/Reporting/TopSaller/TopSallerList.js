import React, { useEffect, useState } from "react";
import { fetchtopsallerData } from "../../../Redux/features/TopSaller/topsallerSlice";
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
import PasswordShow from "../../../Common/passwordShow";

import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import SortIcon from "../../../Assests/Category/SortingW.svg";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
import useDelayedNodata from "../../../hooks/useDelayedNoData";
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
  "&:last-child td, &:last-child th": {
    backgroundColor: "#F5F5F5",
  },
  "& td, & th": {
    border: "none",
  },
}));

const TopSallerList = ({ data }) => {
  const dispatch = useDispatch();

  const [topsaller, settopsaller] = useState([]);
  const showNoData = useDelayedNodata(topsaller)
  const topsallerDataState = useSelector((state) => state.topsaller);
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  useEffect(() => {
    getTopSellerData();
  }, [dispatch, data]);

  const getTopSellerData = async () => {
    try {
      if (!data.merchant_id) {
      } else {
        await dispatch(fetchtopsallerData(data)).unwrap();
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };

  useEffect(() => {
    if (!topsallerDataState.loading && topsallerDataState.topsallerData) {
      settopsaller(topsallerDataState.topsallerData);
    }
  }, [topsallerDataState, topsallerDataState.topsallerData]);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      topsaller,
      type,
      name,
      sortOrder
    );
    settopsaller(sortedItems);
    setSortOrder(newOrder);
  };
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          {topsallerDataState.loading ||
          topsallerDataState.status && !topsaller.length ? (
            <SkeletonTable
              columns={[
                "Item Name",
                "Category",
                "Variant Name",
                "Quantity Sold",
              ]}
            />
          ) : (
            <TableContainer>
              <StyledTable>
                <TableHead>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      onClick={() => sortByItemName("str", "real_name")}
                    >
                      <p>Item Name</p>
                      <img src={SortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      onClick={() => sortByItemName("str", "categoryss")}
                    >
                      <p>Category</p>
                      <img src={SortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      onClick={() => sortByItemName("str", "variant")}
                    >
                      <p>Variant Name</p>
                      <img src={SortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <button
                      className="flex items-center"
                      onClick={() => sortByItemName("num", "total_sold")}
                    >
                      <p>Quantity Sold</p>
                      <img src={SortIcon} alt="" className="pl-1" />
                    </button>
                  </StyledTableCell>
                </TableHead>

                <TableBody>
                  {topsaller.length > 0
                    ? topsaller?.map((topsaller, index) => (
                        <StyledTableRow>
                          <StyledTableCell>
                            <p className="report-title ">
                              {topsaller.real_name}
                            </p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p className="report-title">
                              {topsaller.categoryss}
                            </p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p className="report-title">{topsaller.variant}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p className="report-title">
                              {priceFormate(topsaller.total_sold)}
                            </p>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    : ""}
                </TableBody>
              </StyledTable>
              {showNoData && !topsaller.length && <NoDataFound />}
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default TopSallerList;
