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

const InventoryStocktateHistoryReportList = ({productData}) => {
  const dispatch = useDispatch();
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [allNewItemData, setallNewItemData] = useState([]);
  const AllNewItemDataState = useSelector(
    (state) => state.NewItemCreatedBtnList
  );
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  // useEffect(() => {
  //   getNewItemCreatedBetweenData();
  // }, [props]);
  // const getNewItemCreatedBetweenData = async () => {
  //   try {
  //     if (props && props.selectedDateRange) {
  //       let data = {
  //         merchant_id,
  //         start_date: props.selectedDateRange.start_date,
  //         end_date: props.selectedDateRange.end_date,
  //         ...userTypeData,
  //       };
  //       if (data) {
  //         await dispatch(fetchNewItemCreatedBetweenData(data)).unwrap();
  //       }
  //     }
  //   } catch (error) {
  //     if (error?.status == 401 || error?.response?.status === 401) {
  //       getUnAutherisedTokenMessage();
  //       handleCoockieExpire();
  //     } else if (error.status == "Network Error") {
  //       getNetworkError();
  //     }
  //   }
  // };

  useEffect(() => {
    if (
      !AllNewItemDataState.loading &&
      AllNewItemDataState?.NewItemData &&
      AllNewItemDataState?.NewItemData?.report_data
    ) {
      setallNewItemData(AllNewItemDataState?.NewItemData?.report_data);

    } else {
      setallNewItemData([]);
    }
  }, [AllNewItemDataState, AllNewItemDataState.NewItemData]);


  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  const sortByItemName = (type, name) => {
    const itemsWithParsedDates = allNewItemData.map((item) => {
      const dateString = item.created_on;
      const [day, month, year] = dateString.split("-").map(Number);
      const date = `${year},${month},${day}`;
      return { ...item, created_on: date };
    });
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      itemsWithParsedDates,
      type,
      name,
      sortOrder
    );
    setallNewItemData(
      sortedItems.map((item) => {
        const dateString = item.created_on;
        const [year, month, day] = dateString.split(",").map(Number);
        const customdate = `${day}-${month}-${year}`;
        return { ...item, created_on: customdate };
      })
    );
    setSortOrder(newOrder);
  };

 
  
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
                          // onClick={() => sortByItemName("str", "fullName")}
                        >
                          <p>Product</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          // onClick={() => sortByItemName("num", "pin")}
                        >
                          <p>GoH</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                            className="flex items-center"
                            // onClick={() => sortByItemName("num", "pin")}
                          >
                            <p>Cost</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                      </StyledTableCell>
                      <StyledTableCell>
                        <button
                          className="flex items-center"
                          // onClick={() => sortByItemName("str", "email")}
                        >
                          <p>Total Value</p>
                          <img src={sortIcon} alt="" className="pl-1" />
                        </button>
                      </StyledTableCell>
                      
                    </TableHead>
                    <TableBody>
                      {productData && productData?.length >= 1 ? (
                        productData?.map((employee, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              <p>{employee?.product}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>{employee?.qoh}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>{employee?.cost}</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p>{employee?.totalValue}</p>
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
