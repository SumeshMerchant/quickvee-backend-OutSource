import {
  Grid,
  styled,
  Table,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { useSelector } from "react-redux";
import { priceFormate } from "../../../hooks/priceFormate";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
import emailLogo from "../../../Assests/Dashboard/email.svg";
import phoneLogo from "../../../Assests/Dashboard/phone.svg";
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
export default function StoreCreditReportTable({
  totalValueIssued,
  totalValueRedeemed,
  outStandingsBalance,
  setTotalValueIssued,
  setTotalValueRedeemed,
  setOutStandingsBalance,
  dataArr,
  setDataArr,
  searchRecord,
}) {
  const [sortOrder, setSortOrder] = useState("asc");
  // console.log(dataArr);
  const tableRow = [
    { type: "str", name: "customer_name", label: "Customer" },
    { type: "str", name: "customer_email", label: "Email Address" },
    { type: "num", name: "customer_phone", label: "Phone Number" },
    { type: "num", name: "total_credit_amount", label: "Issued" },
    { type: "num", name: "total_debit_amount", label: "Redeemed" },
    { type: "num", name: "available_balance", label: "Balance" },
  ];

  const StoreCreditReportReduxState = useSelector(
    (state) => state.storeCreditReportList
  );

  useEffect(() => {
    if (
      !StoreCreditReportReduxState.loading &&
      StoreCreditReportReduxState.StoreCreditReportArr
    ) {
      const filteredData =
        StoreCreditReportReduxState.StoreCreditReportArr.filter((item) =>
          item?.customer_name
            ?.toLowerCase()
            ?.includes(searchRecord?.toLowerCase())
        );
      setTotalValueIssued(
        StoreCreditReportReduxState?.StoreCreditReportArr?.reduce(
          (acc, curr) => acc + parseFloat(curr.total_credit_amount),
          0
        )
      );
      setTotalValueRedeemed(
        StoreCreditReportReduxState?.StoreCreditReportArr?.reduce(
          (acc, curr) => acc + parseFloat(curr.total_debit_amount),
          0
        )
      );
      setOutStandingsBalance(
        StoreCreditReportReduxState?.StoreCreditReportArr?.reduce(
          (acc, curr) => acc + parseFloat(curr.available_balance),
          0
        )
      );
      console.log(
        "StoreCreditReportReduxState?.StoreCreditReportArr",
        StoreCreditReportReduxState?.StoreCreditReportArr
      );
      setDataArr(StoreCreditReportReduxState?.StoreCreditReportArr);
    }
  }, [
    StoreCreditReportReduxState,
    StoreCreditReportReduxState.StoreCreditReportArr,
    searchRecord,
  ]);
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      dataArr,
      type,
      name,
      sortOrder
    );
    setDataArr(sortedItems);
    setSortOrder(newOrder);
  };

  return (
    <>
      {
        <Grid container className="box_shadow_div">
          {StoreCreditReportReduxState.loading ||
          (StoreCreditReportReduxState.status &&
            !searchRecord.length &&
            !dataArr.length) ? (
            <SkeletonTable columns={tableRow.map((item) => item.label)} />
          ) : (
            <Grid container>
              <Grid item xs={12}>
                <TableContainer>
                  <StyledTable
                    sx={{ minWidth: 500 }}
                    aria-label="customized table"
                  >
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
                      {dataArr?.length > 0 &&
                        dataArr?.map((item, index) => (
                          <>
                            <StyledTableRow key={index}>
                              <StyledTableCell>
                                <div className="text-[#000000] order_method ">
                                  {item.customer_name?.length < 18
                                    ? item?.customer_name
                                    : item?.customer_name?.slice(0, 18) +
                                        `...` || ""}
                                </div>
                                {/* <div className="text-[#818181]  flex">
                                {item?.customer_email && (
                                  <img
                                    src={emailLogo}
                                    alt=""
                                    className="pe-1"
                                  />
                                )}{" "}
                                <p>{item.customer_email || ""}</p>
                              </div> */}
                                {/* <div className="text-[#818181] flex">
                                {item?.customer_phone && (
                                  <img
                                    src={phoneLogo}
                                    alt=""
                                    className="pe-1"
                                  />
                                )}{" "}
                                <p> {item?.customer_phone || ""}</p>
                              </div> */}
                              </StyledTableCell>
                              <StyledTableCell>
                                <div className="text-[#000000] order_method ">
                                  {!!item?.customer_email
                                    ? item?.customer_email
                                    : ""}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <div className="text-[#000000] order_method ">
                                  {!!item?.customer_phone
                                    ? item?.customer_phone
                                    : ""}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>${priceFormate(item.total_credit_amount)}</p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>${priceFormate(item.total_debit_amount)}</p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p>${priceFormate(item.available_balance)}</p>
                              </StyledTableCell>
                            </StyledTableRow>
                          </>
                        ))}
                      {dataArr.length > 0 && (
                        <StyledTableRow>
                          <StyledTableCell className="trBG_Color" colSpan={3}>
                            <p className="report-sort totalReport">Total</p>
                          </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                            <p className="report-title totalReport">
                              ${priceFormate(totalValueIssued?.toFixed(2))}
                            </p>
                          </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                            <p className="report-title totalReport">
                              ${priceFormate(totalValueRedeemed?.toFixed(2))}
                            </p>
                          </StyledTableCell>
                          <StyledTableCell className="trBG_Color">
                            <p className="report-title totalReport">
                              ${priceFormate(outStandingsBalance?.toFixed(2))}
                            </p>
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </StyledTable>
                  {!dataArr.length && <NoDataFound />}
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </Grid>
      }
    </>
  );
}
