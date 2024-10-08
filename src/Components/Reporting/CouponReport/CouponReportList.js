import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCouponReportData } from "../../../Redux/features/Reports/CouponReport/CouponReportSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { priceFormate } from "../../../hooks/priceFormate";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import PasswordShow from "../../../Common/passwordShow";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
import useDelayedNodata from "../../../hooks/useDelayedNoData";
import { formatDate } from "../../../Constants/utils";

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

const CouponReportList = (props) => {
  const dispatch = useDispatch();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();

  const showNoData = useDelayedNodata(props.CouponReportData);
  const [sortOrder, setSortOrder] = useState("asc");
  const CouponReportDataState = useSelector((state) => state.CouponReportList);
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  useEffect(() => {
    getCouponReportData();
  }, [props.selectedDateRange, dispatch, props.selectedCoupon]);
  const getCouponReportData = async () => {
    if (props && props.selectedDateRange) {
      try {
        const startDateData = props.selectedDateRange.start_date;
        const endDateData = props.selectedDateRange.end_date;
        let data = {
          merchant_id,
          start_date: startDateData,
          end_date: endDateData,
          coupon_code: props.selectedCoupon,
          ...userTypeData,
        };

        if (data) {
          await dispatch(fetchCouponReportData(data)).unwrap();
        }
      } catch (error) {
        console.log(error);
        if (error.status == 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        }
      }
    }
  };

  useEffect(() => {
    if (
      !CouponReportDataState.loading &&
      CouponReportDataState.CouponReportData
    ) {
      const uodatedList = Array.isArray(CouponReportDataState?.CouponReportData)
        ? CouponReportDataState?.CouponReportData?.map((item) => {
            return {
              ...item,
              couponName:
                item.coupon_type === "Discount"
                  ? "Direct Discount By App"
                  : item.coupon_type,
            };
          })
        : "";
      console.log("uodatedList", uodatedList);
      props.setCouponReportData(uodatedList);
    } else {
      props.setCouponReportData([]);
    }
  }, [CouponReportDataState.loading, CouponReportDataState.CouponReportData]);

  const tableRow = [
    { type: "date", name: "date", label: "Date" },
    { type: "str", name: "couponName", label: "Coupon Name" },
    { type: "num", name: "total_coupons_used", label: "Total Coupon Used" },
    { type: "num", name: "total_discount", label: "Total Amount Discounted" },
  ];
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      props.CouponReportData,
      type,
      name,
      sortOrder
    );
    props.setCouponReportData(sortedItems);
    setSortOrder(newOrder);
  };

  console.log("props.CouponReportData.length", props.CouponReportData.length);
  console.log("props.CouponReportData.status", props.CouponReportData.status);
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          {CouponReportDataState.loading ||
          (CouponReportDataState.status && !props.CouponReportData.length) ? (
            <SkeletonTable columns={tableRow.map((item) => item.label)} />
          ) : (
            <TableContainer>
              <StyledTable sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                  {tableRow.map((item, index) => (
                    <StyledTableCell key={index}>
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
                  {props.CouponReportData.length > 0 &&
                    props.CouponReportData.map((couponData, index) => (
                      <StyledTableRow>
                        <StyledTableCell>
                          <p className="report-title">
                            {formatDate(couponData.date)}
                          </p>
                        </StyledTableCell>
                        <StyledTableCell>
                          <p>{couponData.couponName}</p>
                        </StyledTableCell>
                        <StyledTableCell>
                          <p className="report-title">
                            {priceFormate(couponData.total_coupons_used)}
                          </p>
                        </StyledTableCell>
                        <StyledTableCell>
                          <p className="report-title">
                            $
                            {priceFormate(
                              parseFloat(couponData.total_discount).toFixed(2)
                            )}
                          </p>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </StyledTable>
              {showNoData && !props.CouponReportData.length && <NoDataFound />}
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CouponReportList;
