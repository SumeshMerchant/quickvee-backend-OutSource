import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Grid, Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SkeletonTable } from "../../../reuseableComponents/SkeletonTable";
import CircularProgress from "@mui/material/CircularProgress";
import SmallLoader from "../../../Assests/Loader/loading-Animation.gif";

import {
  getVerifiedMerchant,
  getVerifiedMerchantCount,
} from "../../../Redux/features/user/verifiedMerchantSlice";
import { handleMoveDash } from "../../../Redux/features/user/unverifiedMerchantSlice";
import { getAuthInvalidMessage } from "../../../Redux/features/Authentication/loginSlice";
import { useAuthDetails } from "../../../Common/cookiesHelper";
import AddIcon from "../../../Assests/Category/addIcon.svg";
import InputTextSearch from "../../../reuseableComponents/InputTextSearch";
import View from "../../../Assests/VerifiedMerchant/View.svg";
import Edit from "../../../Assests/VerifiedMerchant/Edit.svg";
import Delete from "../../../Assests/VerifiedMerchant/Delete.svg";
import DisLike from "../../../Assests/VerifiedMerchant/DisLike.svg";
import PasswordShow from "../../../Common/passwordShow";
import {
  BASE_URL,
  DELETE_SINGLE_STORE,
  UNAPPROVE_SINGLE_STORE,
  EXPORTCSV,
} from "../../../Constants/Config";
import Pagination from "../UnverifeDetails/Pagination";
import useDebounce from "../../../hooks/useDebouncs";
import DeleteModal from "../../../reuseableComponents/DeleteModal";
import DislikeModal from "../../../reuseableComponents/DislikeModal";
import emailLogo from "../../../Assests/Dashboard/email.svg";
import phoneLogo from "../../../Assests/Dashboard/phone.svg";
import ipLogo from "../../../Assests/Dashboard/IP.svg";
import { setIsStoreActive } from "../../../Redux/features/NavBar/MenuSlice";
import sortIcon from "../../../Assests/Category/SortingW.svg";
import { SortTableItemsHelperFun } from "../../../helperFunctions/SortTableItemsHelperFun";
import NoDataFound from "../../../reuseableComponents/NoDataFound";
const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2,
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "& td, & th": {
    border: "none",
  },
}));
const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#f5f5f9",
    "&::before": {
      border: "1px solid #dadde9",
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(16),
    border: "1px solid #dadde9",
  },
}));
export default function Verified({ setVisible, setMerchantId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  // states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchRecord, setSearchRecord] = useState("");
  const [storename, setStorename] = useState();
  const [submitmessage, setsubmitmessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [deletedId, setDeletedId] = useState("");

  const [loaders, setLoaders] = useState({
    view: {
      id: "",
      isLoading: false,
    },
  });

  const verifiedMerchantList = useSelector(
    (state) => state.verifiedMerchantRecord
  );

  const [VerifiedMerchantListState, setVerifiedMerchantListState] = useState(
    []
  );

  const { userTypeData } = useAuthDetails();
  const debouncedValue = useDebounce(searchRecord);
  const data_verified = {
    type: "approve",
    ...userTypeData,
    perpage: rowsPerPage,
    page: currentPage,
    search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
  };
  const getVerifiedRecord = async () => {
    try {
      await dispatch(getVerifiedMerchant(data_verified)).unwrap();
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
    getVerifiedRecord();
  }, [currentPage, debouncedValue, rowsPerPage]);
  const fetchVerifiedMerchantCount = async () => {
    try {
      await dispatch(
        getVerifiedMerchantCount({
          type: "approve",
          ...userTypeData,
          search_by: Boolean(debouncedValue.trim()) ? debouncedValue : null,
        })
      ).unwrap();
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
    fetchVerifiedMerchantCount();
  }, [debouncedValue]);

  useEffect(() => {
    if (!verifiedMerchantList.loading && verifiedMerchantList) {
      setTotalCount(verifiedMerchantList?.verifiedMerchantCount);
      setVerifiedMerchantListState(verifiedMerchantList?.verifiedMerchantData);
    }
  }, [
    verifiedMerchantList.verifiedMerchantCount,
    verifiedMerchantList.verifiedMerchantData,
  ]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchInputChange = (value) => {
    setSearchRecord(value);
    setCurrentPage(1);
  };

  const handleEditMerchant = (data) => {
    console.log("handleEditMerchant", data);
    navigate(`/users/approve/editMerchant/${data}`);
  };
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteTableId, setDeleteTableId] = useState(null);
  const [deleteMerchantId, setDeleteMerchantId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dislikeModalOpen, setDislikeModalOpen] = useState(false);
  const handleDeleteMerchant = async (tableData) => {
    setDeleteTableId(tableData);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (deleteTableId) {
      try {
        const { token, ...otherUserData } = userTypeData;
        const delVendor = {
          merchant_id: deleteTableId.merchant_id,
          id: deleteTableId.id,
          ...otherUserData,
        };
        setDeleteModalOpen(false);
        setDeleteLoader(true);
        setDeletedId(deleteTableId.id);

        const response = await axios.post(
          BASE_URL + DELETE_SINGLE_STORE,
          delVendor,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) {
          setDeleteLoader(false);
          setDeletedId("");
          dispatch(getVerifiedMerchant(data_verified));
        } else {
          setDeleteLoader(false);
          setDeletedId("");
          console.error(response);
        }
      } catch (error) {
        if (error.status == 401 || error.response.status === 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status == "Network Error") {
          getNetworkError();
        }
      }
    }
    setDeleteModalOpen(false);
    setDeleteTableId(null);
  };

  const confirmDislikeStore = async () => {
    if (deleteMerchantId) {
      try {
        const { token, ...otherUserData } = userTypeData;
        const delVendor = {
          id: deleteMerchantId,
          ...otherUserData,
        };

        const response = await axios.post(
          BASE_URL + UNAPPROVE_SINGLE_STORE,
          delVendor,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) {
          dispatch(getVerifiedMerchant(data_verified));
        } else {
          console.error(response);
        }
      } catch (error) {
        if (error.status == 401 || error.response.status === 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status == "Network Error") {
          getNetworkError();
        }
      }
      setDeleteMerchantId(null);
      setDislikeModalOpen(false);
    }
  };

  const handleGetVerifiedMerchant = async (merchant_id) => {
    try {
      setLoaders({ view: { id: merchant_id, isLoading: true } });
      let data = {
        merchant_id: merchant_id,
        ...userTypeData,
      };

      await dispatch(handleMoveDash(data)).then((result) => {
        if (result?.payload?.status == true) {
          if (result?.payload?.final_login == 1) {
            navigate(`/`);
            dispatch(setIsStoreActive(true));
          } else {
            console.log("store page called");
          }
        } else {
          Cookies.remove("loginDetails");
          Cookies.remove("user_auth_record");
          dispatch(getAuthInvalidMessage(result?.payload?.msg));
          navigate("/login");
        }
      });
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    } finally {
      setLoaders({ view: { id: "", isLoading: false } });
    }
  };

  const hadleDislikeMerchant = async (merchant_id) => {
    setDeleteMerchantId(merchant_id);
    setDislikeModalOpen(true);
  };

  const handleExportTransaction = async (type) => {
    try {
      const { token, ...otherUserData } = userTypeData;
      const delVendor = {
        type: type,
        ...otherUserData,
      };
      setLoader(true);

      const response = await axios.post(BASE_URL + EXPORTCSV, delVendor, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setLoader(false);
        const csvData = response.data;
        const blob = new Blob([csvData], { type: "text/csv" });
        const fileUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = "Inventory_" + storename + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(fileUrl);
        setsubmitmessage("Inventory Exported Successfully");
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = ["Store Info", "Owner Name", "Merchant ID", ""];
  const sortByItemName = (type, name) => {
    const { sortedItems, newOrder } = SortTableItemsHelperFun(
      VerifiedMerchantListState,
      type,
      name,
      sortOrder
    );
    setVerifiedMerchantListState(sortedItems);
    setSortOrder(newOrder);
  };
  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderBottom: "1px solid #E8E8E8",
            }}
          >
            <Grid item>
              <div className="q-category-bottom-header">
                <span>Verified Merchant</span>
              </div>
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <div
                    onClick={() => {
                      handleExportTransaction(2);
                    }}
                    className="flex q-category-bottom-header"
                  >
                    <span className="quic-btn-save excelLoader">
                      {loader ? <CircularProgress /> : ""}
                    </span>
                    <p className="me-2">Export Last Transaction</p>
                  </div>
                </Grid>
                <Grid
                  style={{
                    borderLeft: "1px solid #E8E8E8",
                    height: "30px",
                  }}
                ></Grid>
                <Grid item>
                  <Link
                    to="/users/addMerchant"
                    className="flex q-category-bottom-header "
                    state={{ from: "/users/approve", heading: "Merchant" }}
                  >
                    <p className="me-2">ADD</p>
                    <img src={AddIcon} alt="" />
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
                showEntries={true}
                data={VerifiedMerchantListState}
              />
            </Grid>
          </Grid>

          <Grid container>
            {verifiedMerchantList.loading ? (
              <>
                <SkeletonTable columns={columns} />
              </>
            ) : (
              <>
                {VerifiedMerchantListState &&
                Array.isArray(VerifiedMerchantListState) &&
                VerifiedMerchantListState?.length > 0 ? (
                  <TableContainer>
                    <StyledTable
                      sx={{ minWidth: 500 }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "name")}
                          >
                            <p>Store Info</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "owner_name")}
                          >
                            <p>Owner Name</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            className="flex items-center"
                            onClick={() => sortByItemName("str", "merchant_id")}
                          >
                            <p>Merchant ID</p>
                            <img src={sortIcon} alt="" className="pl-1" />
                          </button>
                        </StyledTableCell>
                        <StyledTableCell>Action</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {VerifiedMerchantListState?.map((data, index) => (
                          <StyledTableRow key={data.id}>
                            <StyledTableCell>
                              <div className="flex cursor-default">
                                <BootstrapTooltip
                                  title={
                                    <p className="capitalize">{data.name}</p>
                                  }
                                >
                                  <div className="text-[#000000] order_method capitalize">
                                    {data.name.length < 18
                                      ? data.name
                                      : data.name.slice(0, 18) + `...` || ""}
                                  </div>
                                </BootstrapTooltip>
                                <div className="mx-2 ">
                                  (State: {data.a_state})
                                </div>
                              </div>
                              <div className="text-[#818181] lowercase flex">
                                {data.email && (
                                  <img
                                    src={emailLogo}
                                    alt=""
                                    className="pe-1"
                                  />
                                )}{" "}
                                <p>{data.email || ""}</p>
                              </div>
                              <div className="text-[#818181] flex">
                                {data.a_phone && (
                                  <img
                                    src={phoneLogo}
                                    alt=""
                                    className="pe-1"
                                  />
                                )}{" "}
                                <p> {data.a_phone || ""}</p>
                              </div>
                              <div className="text-[#818181] flex">
                                {data.ipv4 && (
                                  <img src={ipLogo} alt="" className="pe-1" />
                                )}{" "}
                                <p> {data.ipv4 || ""}</p>
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method capitalize">
                                {data.owner_name || ""}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="text-[#000000] order_method ">
                                {data.merchant_id || ""}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell>
                              <div className="flex">
                                {loaders.view.id === data.merchant_id &&
                                loaders.view.isLoading ? (
                                  <img src={SmallLoader} alt="loading" />
                                ) : (
                                  <img
                                    className="mx-1 view cursor-pointer"
                                    onClick={() =>
                                      handleGetVerifiedMerchant(
                                        data.merchant_id
                                      )
                                    }
                                    src={View}
                                    alt="View"
                                    title="View"
                                  />
                                )}

                                <img
                                  className="mx-1 edit cursor-pointer"
                                  onClick={() => handleEditMerchant(data.id)}
                                  src={Edit}
                                  alt="Edit"
                                  title="Edit"
                                />

                                {data.id == deletedId && deleteLoader ? (
                                  <img src={SmallLoader} alt="loading" />
                                ) : (
                                  <img
                                    className="mx-1 delete cursor-pointer"
                                    onClick={() => handleDeleteMerchant(data)}
                                    src={Delete}
                                    alt="Delete"
                                    title="Delete"
                                  />
                                )}

                                <img
                                  className="mx-1 cursor-pointer"
                                  onClick={() => hadleDislikeMerchant(data.id)}
                                  src={DisLike}
                                  alt="DisLike"
                                  title="Disapprove"
                                />
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                ) : (
                  <NoDataFound table={true} />
                )}
              </>
            )}
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
                showEntries={false}
                data={VerifiedMerchantListState}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DeleteModal
        headerText="Verified Merchant"
        otherMSG="Once The store is deleted Inventory and settings cannot be restored."
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteCategory}
      />
      <DislikeModal
        headerText="Are you sure you want to Disapprove this store"
        open={dislikeModalOpen}
        onClose={() => {
          setDislikeModalOpen(false);
        }}
        onConfirm={confirmDislikeStore}
      />
    </>
  );
}
