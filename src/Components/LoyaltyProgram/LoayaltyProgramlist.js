import React, { useEffect, useState } from "react";
import {
  fetchloyaltyprogramData,
  getLoyaltyCount,
} from "../../Redux/features/LoyaltyProgram/loyaltyprogramSlice";
import { useSelector, useDispatch } from "react-redux";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.min.css";

import Left from "../../Assests/Taxes/Left.svg";
import Right from "../../Assests/Taxes/Right.svg";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "../../AllUserComponents/Users/UnverifeDetails/Pagination";
import useDebounce from "../../hooks/useDebouncs";
import { SkeletonTable } from "../../reuseableComponents/SkeletonTable";
import InputTextSearch from "../../reuseableComponents/InputTextSearch";
import { priceFormate } from "../../hooks/priceFormate";
import PasswordShow from "../../Common/passwordShow";
import sortIcon from "../../Assests/Category/SortingW.svg"
import { SortTableItemsHelperFun } from "../../helperFunctions/SortTableItemsHelperFun";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2, // Adjust padding as needed
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#253338",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.table}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const LoyaltyProgramList = () => {
  const dispatch = useDispatch();
  const loyaltyprogramDataState = useSelector((state) => state.loyaltyprogram);
  const [loyaltyprogram, setLoyaltyprogram] = useState([]);
  $.DataTable = require("datatables.net");
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchRecord, setSearchRecord] = useState("");
  const debouncedValue = useDebounce(searchRecord);

  const [sortOrder, setSortOrder] = useState("asc");
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { getUnAutherisedTokenMessage, handleCoockieExpire } = PasswordShow();

  useEffect(() => {
    // let data = {
    //   merchant_id: merchant_id,
    //   page: currentPage,
    //   perpage: rowsPerPage,
    //   search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
    //   ...userTypeData,
    // };
    // dispatch(fetchloyaltyprogramData(data));
    getloyaltyprogramData();
  }, [currentPage, debouncedValue, rowsPerPage]);

  const getloyaltyprogramData = async () => {
    try {
      let data = {
        merchant_id: merchant_id,
        page: currentPage,
        perpage: rowsPerPage,
        search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
        ...userTypeData,
      };
      await dispatch(fetchloyaltyprogramData(data)).unwrap();
    } catch (error) {
      handleCoockieExpire();
      getUnAutherisedTokenMessage();
    }
  };

  useEffect(() => {
    const data = {
      merchant_id: merchant_id,
      search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
      ...userTypeData,
    };
    dispatch(getLoyaltyCount(data));
  }, [debouncedValue]);
  useEffect(() => {
    setTotalCount(loyaltyprogramDataState.loyaltyOrderCount);
  }, [loyaltyprogramDataState.loyaltyOrderCount]);

  useEffect(() => {
    if (
      !loyaltyprogramDataState.loading &&
      loyaltyprogramDataState.loyaltyprogramData
    ) {
      setLoyaltyprogram(loyaltyprogramDataState.loyaltyprogramData.map((item)=>(
        {...item,fullName: `${item.f_name || ""}  ${item.l_name || ""}`}
      )));
    }
  }, [
    loyaltyprogramDataState.loading,
    loyaltyprogramDataState.loyaltyprogramData,
  ]);

  // useEffect(() => {
  //   const modifiedData = loyaltyprogram.map(user => ({
  //       "Customer Name": `${user.f_name || ""} ${user.l_name || ""}`,
  //       "Customer Email": `${user.email || ""}`,
  //       "Customer Phone": `${user.phone || ""}`,
  //       "Customer Loyalty": `${user.total_loyalty_pts || ""}`,
  //       "Customer Store Credit": `${user.total_store_credit || ""}`,
  //     }));

  //   const table = $('#loyaltyProgramTable').DataTable({
  //     data: modifiedData,
  //     columns: [
  //       { title: "Customer Name", data: "Customer Name", orderable: false },
  //       { title: "Customer Email", data: "Customer Email", orderable: false },
  //       { title: "Customer Phone", data: "Customer Phone", orderable: false },
  //       { title: "Customer Loyalty", data: "Customer Loyalty", orderable: false },
  //       { title: "Customer Store Credit", data: "Customer Store Credit", orderable: false },
  //     ],
  //     destroy: true,
  //     searching: true,
  //     dom: "<'row 'l<'col-sm-5'><'col-sm-7'>f<'col-sm-12't>><'row'i<'col-sm-7 mt-5'>p<'col-sm-5'>>",
  //     lengthMenu: [ 10, 20, 50],
  //     lengthChange: true,
  //     ordering: false,
  //     language: {
  //       paginate: {
  //         previous: '<img src="'+Left+'" alt="left" />',
  //         next: '<img src="'+Right+'" alt="right" />',
  //       },
  //       search: '_INPUT_',
  //         searchPlaceholder: ' Search...'
  //     }
  //   });

  //   $('#searchInput').on('input', function () {
  //     table.search(this.value).draw();
  //   });

  //   return () => {
  //     table.destroy();
  //   }
  // }, [loyaltyprogram]);

  const handleSearchInputChange = (value) => {
    setSearchRecord(value);
    setCurrentPage(1);
  };

  const tableRow = [
    { type: "str", name: "fullName", label: "Customer Name" },
    { type: "str", name: "email", label: "Customer Email" },
    { type: "num", name: "phone", label: "Customer Phone" },
    { type: "num", name: "total_loyalty_pts", label: "Customer Loyalty" },
    { type: "num", name: "total_store_credit", label: "Customer Store Credit" },
  ];
  const columns = [
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Customer Loyalty",
    "Customer Store Credit",
  ];
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      loyaltyprogram,
      type,
      name,
      sortOrder
    );
    setLoyaltyprogram(sortedItems);
    setSortOrder(newOrder);
  };
  return (
    <>
      {/* <div className="box">
         <div className="box_shadow_div">
            <table  id="loyaltyProgramTable"></table>
         </div>
    </div> */}

      <Grid container className="box_shadow_div">
        <Grid item className="q-category-bottom-header" xs={12}>
          <h1 className="text-xl font-medium">Loyalty Program</h1>
        </Grid>
        <Grid item xs={12}>
          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <InputTextSearch
                className=""
                type="text"
                value={searchRecord}
                handleChange={handleSearchInputChange}
                placeholder="Search..."
                autoComplete="off"
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: 2.5 }}>
            <Grid item xs={12}>
              <Pagination
                currentPage={currentPage}
                totalItems={totalCount}
                itemsPerPage={rowsPerPage}
                onPageChange={paginate}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </Grid>
          </Grid>

          <Grid container>
            {loyaltyprogramDataState.loading ? (
              <>
                <SkeletonTable columns={tableRow.map((item) => item.label)} />
              </>
            ) : (
              <>
                {loyaltyprogram &&
                loyaltyprogram.length >= 1 &&
                Array.isArray(loyaltyprogram) ? (
                  <TableContainer>
                    <StyledTable
                      sx={{ minWidth: 500 }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        {tableRow.map((item) => (
                          <StyledTableCell>
                            <button
                              className="flex items-center"
                              onClick={() =>
                                sortByItemName(item.type, item.name)
                              }
                            >
                              <p>{item.label}</p>
                              <img src={sortIcon} alt="" className="pl-1" />
                            </button>
                          </StyledTableCell>
                        ))}
                      </TableHead>
                      
                      <TableBody>
                        {loyaltyprogram.map((Loyaltydata, index) => (
                          <StyledTableRow key={Loyaltydata.id}>
                            <StyledTableCell>
                              <div className="text-[#000000] lowercase">
                                {/* {Loyaltydata.f_name || ""}{" "}
                                {Loyaltydata.l_name || ""} */}
                                {Loyaltydata.fullName}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] ">
                                {Loyaltydata.email}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method ">
                                {Loyaltydata.phone}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method ">
                                {priceFormate(Loyaltydata.total_loyalty_pts)}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method ">
                                {priceFormate(Loyaltydata.total_store_credit)}
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                ) : (
                  <p className="px-5 py-4">No Data Found</p>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoyaltyProgramList;
