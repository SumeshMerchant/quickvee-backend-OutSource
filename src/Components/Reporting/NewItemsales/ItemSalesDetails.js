import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNewItemSalesData } from "../../../Redux/features/Reports/NewItemSales/NewItemSalesSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import { Grid } from "@mui/material";
import { LuPlus, LuMinus } from "react-icons/lu";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priceFormate } from "../../../hooks/priceFormate";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
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

const ItemSalesDetails = (props) => {
  const dispatch = useDispatch();
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [sortOrder, setSortOrder] = useState("asc");
  const [allItemSalesData, setallItemSalesData] = useState([]);
  const showNoData = useDelayedNodata(allItemSalesData);
  const [apiStatus, setapiStatus] = useState(false);
  const AllItemSalesDataState = useSelector(
    (state) => state.NewItemSalesReportList
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    getFetchItemSalesData();
  }, [props]);

  const getFetchItemSalesData = async () => {
    if (props && props.selectedDateRange) {
      try {
        let data = {
          merchant_id,
          start_date: props.selectedDateRange.start_date,
          end_date: props.selectedDateRange.end_date,
          order_typ: props.OrderTypeData,
          order_env: props.OrderSourceData,
          cat_name: props.SelectCatData,
          search_by: props.items,
          ...userTypeData,
        };
        if (data) {
          await dispatch(fetchNewItemSalesData(data)).unwrap();
        }
      } catch (error) {
        if (error.status == 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
    }
  };

  useEffect(() => {
    if (
      !AllItemSalesDataState.loading &&
      AllItemSalesDataState.NewItemSalesData &&
      AllItemSalesDataState.NewItemSalesData[0]
    ) {
      setallItemSalesData(AllItemSalesDataState.NewItemSalesData[0]);
      setapiStatus(AllItemSalesDataState.NewItemSalesData[3]);
    } else {
      setallItemSalesData([]);
      // setapiStatus(false);
      !AllItemSalesDataState?.NewItemSalesData && setapiStatus(false);
    }
  }, [AllItemSalesDataState, AllItemSalesDataState.NewItemSalesData]);
  const tableRow = [
    { type: "str", name: "categoryss", label: "Category" },
    { type: "str", name: "name", label: "Name" },
    { type: "num", name: "total_qty", label: "# Sold" },
    { type: "num", name: "total_price", label: "Gross Sales" },
    { type: "num", name: "adjust_price", label: "Price Override" },
    { type: "num", name: "discount_amt", label: "Discounts" },
    { type: "num", name: "saletx", label: "Default Tax" },
    { type: "num", name: "othertx", label: "Other Tax" },
    { type: "num", name: "refund_amount", label: "Refunded" },
    { type: "num", name: "discount_price", label: "Net Sales" },
  ];
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      allItemSalesData,
      type,
      name,
      sortOrder
    );
    setallItemSalesData(sortedItems);
    setSortOrder(newOrder);
    setExpandedRowIndex(null);
  };

  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const toggleRowExpansion = (index) => {
    setExpandedRowIndex(expandedRowIndex === index ? null : index);
  };
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          {/* <div className="q-attributes-bottom-header">
            <span>Item Sales Report</span>
          </div> */}
          {AllItemSalesDataState.loading ||
          (apiStatus && !allItemSalesData.length) ? (
            <SkeletonTable columns={tableRow.map((item) => item.label)} />
          ) : (
            <TableContainer>
              <StyledTable sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  {tableRow.map((item) => (
                    <StyledTableCell>
                      <button
                        className="flex items-center"
                        onClick={() => sortByItemName(item.type, item.name)}
                      >
                        <p>{item.label}</p>
                        <img src={sortIcon} alt="" className="pl-1" />
                      </button>
                    </StyledTableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {allItemSalesData &&
                    allItemSalesData.length >= 1 &&
                    allItemSalesData.map((ItemData, index) => (
                      <React.Fragment key={index}>
                        <StyledTableRow>
                          <StyledTableCell>
                            <p className="flex item-center ">
                              {!!ItemData.categoryss &&ItemData.categoryss !== "Deleted" && ItemData?.variant_details.length >= 1  && (
                                <span
                                  className="pr-2 cursor-pointer"
                                  onClick={() => toggleRowExpansion(index)}
                                >
                                  <LuPlus />
                                </span>
                              )}
                              {!!ItemData.categoryss ?  ItemData.categoryss: "Deleted"}
                            </p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{ItemData.name}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>{priceFormate(ItemData.total_qty)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.total_price)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.adjust_price)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.discount_amt)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.saletx)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.othertx)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.refund_amount)}</p>
                          </StyledTableCell>
                          <StyledTableCell>
                            <p>${priceFormate(ItemData.discount_price)}</p>
                          </StyledTableCell>
                        </StyledTableRow>
                        {/* for  Expand Start  */}
                        {expandedRowIndex === index && ItemData?.variant_details && (
                          <>
                            {ItemData?.variant_details.length >= 1 &&
                                ItemData?.variant_details.map((data, index) => (
                                    <StyledTableRow key={index}>
                                  {/* <StyledTableCell ></StyledTableCell> */}
                                  <StyledTableCell><p className="pl-5">{data?.categoryss}</p></StyledTableCell>
                                  <StyledTableCell><p className="pl-5">{data?.name}</p></StyledTableCell>
                                  <StyledTableCell colSpan={8}></StyledTableCell>
                                </StyledTableRow>
                            ))}
                            
                          </>
                        )}
                        {/* for  Expand End */}

                      </React.Fragment>
                    ))}
                </TableBody>
              </StyledTable>
              {showNoData && !allItemSalesData.length >= 1 && <NoDataFound />}
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ItemSalesDetails;
