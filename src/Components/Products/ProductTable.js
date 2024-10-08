import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "../../Assests/Category/addIcon.svg";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import SortIcon from "../../Assests/Category/Sorting.svg";

import {
  changeOnlineOrderMethod,
  changeShowStatusProduct,
  changeShowType,
  deleteProductAPI,
  fetchProductsData,
} from "../../Redux/features/Product/ProductSlice";
import { BASE_URL, SORT_CATOGRY_DATA } from "../../Constants/Config";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuthDetails } from "../../Common/cookiesHelper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import { memo } from "react";
import PasswordShow from "../../Common/passwordShow";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { fetchStoreSettingSetupData } from "../../Redux/features/SettingSetup/SettingSetupSlice";
import { changeShowStatus } from "../../Redux/features/Product/ProductSlice";
import Skeleton from "react-loading-skeleton";
import DeleteModal from "../../reuseableComponents/DeleteModal";
import NoDataFound from "../../reuseableComponents/NoDataFound";
import ImportImageModal from "./ImportImageModal";
import { Grid, Tooltip, tooltipClasses } from "@mui/material";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    // border: 0,
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
    maxWidth: 180,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
    transform: "translateX(-80px)",
    left: "-80px",
  },
}));

const ProductTable = ({
  selectedListingType,
  selectedListingTypeValue,
  categoryId,
  selectedStatus,
  selectedStatusValue,
  debouncedValue,
  handleProductUnCheck,
  handleProductCheck,
  productIdList,
  productByImages,
}) => {
  const hasFocused = useRef(false);
  const searchCategory = new URLSearchParams(window.location.search);
  const categoryUrl = searchCategory.get("category");
  const statusUrl = searchCategory.get("status");
  const listingUrl = searchCategory.get("listingType");
  const imageUrl = searchCategory.get("filterBy");
  const searchUrl = searchCategory.get("search")?.toLowerCase();
  let listing_type = 0;
  const ProductsListDataState = useSelector((state) => state.productsListData);

  const { hasMore, offset, loading } = useSelector(
    (state) => state.productsListData
  );
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();

  const { getUnAutherisedTokenMessage, handleCoockieExpire, getNetworkError } =
    PasswordShow();
  const navigate = useNavigate();
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;
  const [checkApproved, setCheckApproved] = useState(false);
  const [checkReject, setCheckReject] = useState(false);

  const [productList, setproductsList] = useState([]);
  const [inventoryApproval, setInventoryApproval] = useState();
  const [checkboxState, setCheckboxState] = useState({});
  const [deleteloading, setDeleteloading] = useState(false);

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
      fontSize: theme.typography.pxToRem(13),
      border: "1px solid #dadde9",
    },
  }));

  const dispatch = useDispatch();
  useEffect(() => {
    if (ProductsListDataState?.productsData?.length) {
      setproductsList(ProductsListDataState?.productsData);
    } else {
      setproductsList([]);
    }
  }, [ProductsListDataState, ProductsListDataState?.productsData, dispatch]);

  /// focus on product when product get edit or open by user.
  // const selectedProductId = useMemo(() => {
  //   const productFocusData = JSON.parse(
  //     localStorage.getItem("product-focus-data")
  //   );
  //   return productFocusData?.var_id
  //     ? productFocusData?.var_id
  //     : productFocusData?.productId;
  // }, []);

  // const productIndex = useMemo(() => {
  //   if (!selectedProductId || !productList?.length) return -1;
  //   return productList.findIndex((item) =>
  //     item?.var_id
  //       ? item.var_id === selectedProductId
  //       : item.id === selectedProductId
  //   );
  // }, [selectedProductId, productList]);

  // useEffect(() => {
  //   let timer;
  //   let focusId;
  //   if (!hasFocused.current && productIndex !== -1) {
  //     const targetElement = document.getElementById(`row-${selectedProductId}`);

  //     if (targetElement) {
  //       targetElement.classList.add("product-line-highlight-bg");
  //       targetElement.scrollIntoView({ block: "center" });
  //       hasFocused.current = true;

  //       timer = setTimeout(() => {
  //         localStorage.removeItem("product-focus-data");
  //       }, 500);

  //       focusId = setTimeout(() => {
  //         targetElement.classList.remove("product-line-highlight-bg");
  //       }, 3000);
  //     }
  //   }

  //   return () => clearTimeout(timer, focusId);
  // }, [productIndex]);

  const fetchInventoryData = async () => {
    try {
      const res = await dispatch(
        fetchStoreSettingSetupData({
          merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
        })
      ).unwrap();

      setInventoryApproval(Boolean(+res?.inventory_approval));
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
    fetchInventoryData();
    // let timer;
    // if (localStorage.getItem("product-focus-data") !== null) {
    //   timer = setTimeout(() => {
    //     localStorage.removeItem("product-focus-data");
    //   }, 600);
    // }

    // return () => clearTimeout(timer);
  }, []);

  const checkStatus = (status) => {
    switch (status) {
      case "1":
        return { text: "Approved", color: "green" };
      case "2":
        return { text: "Rejected", color: "red" };
      case "0":
        return { text: "Pending", color: "#0a64f9" };
      default:
        return { text: "Pending", color: "#0a64f9" };
    }
  };

  const Avail_Online = (event, showtype) => {
    const { name, value, id } = event?.target;

    let updateValue = "";
    if (showtype === "0" && name === "delivery_check") {
      updateValue = "1";
    } else if (showtype === "1" && name === "delivery_check") {
      updateValue = "0";
    } else if (showtype === "2" && name === "delivery_check") {
      updateValue = "3";
    } else if (showtype === "3" && name === "delivery_check") {
      updateValue = "2";
    } else if (showtype === "1" && name === "pickup_check") {
      updateValue = "3";
    } else if (showtype === "2" && name === "pickup_check") {
      updateValue = "0";
    } else if (showtype === "3" && name === "pickup_check") {
      updateValue = "1";
    } else if (showtype === "0" && name === "pickup_check") {
      updateValue = "2";
    }

    const data = {
      product_id: id,
      status: updateValue,
      merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
      ...userTypeData,
    };
    dispatch(changeOnlineOrderMethod(data)).then((res) => {
      if (res?.payload?.status) {
        dispatch(changeShowType({ updateValue, id }));
      } else {
        ToastifyAlert("Online Ordering Unabled to change.", "error");
      }
    });
  };

  const update_status = (event, showStatus) => {
    const userConfirmed = window.confirm("Are you sure want to save changes ?");

    if (!userConfirmed) {
      return; // If the user clicks "No", exit the function
    }

    const { name, id } = event?.target;

    const data = {
      product_id: id,
      check: showStatus,
      merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
      ...userTypeData,
    };
    dispatch(changeShowStatusProduct(data)).then((res) => {
      if (res?.payload?.status) {
        setCheckboxState((prevState) => ({
          ...prevState,
          [id]: {
            approved: showStatus === 1,
            rejected: showStatus === 2,
          },
        }));
        dispatch(changeShowStatus({ showStatus, id }));
      } else {
        setCheckboxState((prevState) => ({
          ...prevState,
          [id]: {
            approved: false,
            rejected: false,
          },
        }));
        ToastifyAlert("Show status unable to change", "error");
      }
    });
  };

  const fetchMoreData = async () => {
    let page = 0;
    if (productList.length > 0) {
      page = productList.length / 10;
    }
    if (selectedListingType == "Variant listing" || +listingUrl === 1) {
      listing_type = 1;
    } else {
      listing_type = 0;
    }

    let data1 = {
      merchant_id,
      format: "json",
      // category_id: categoryId === "All" ? "all" : categoryId,
      // show_status: selectedStatus,
      category_id: categoryUrl === 0 || categoryUrl ? categoryUrl : "all",
      show_status: statusUrl === 0 || statusUrl ? statusUrl : "all",
      name: searchUrl?.trim(),
      is_media_blank: imageUrl === "all" ? "" : imageUrl,
      listing_type: listingUrl === 0 || listingUrl ? listingUrl : "0",
      offset: offset ? offset : 0,
      // limit:
      //   JSON.parse(localStorage.getItem("product-focus-data")) &&
      //   JSON.parse(localStorage.getItem("product-focus-data"))?.limit
      //     ? JSON.parse(localStorage.getItem("product-focus-data"))?.limit
      //     : 10,
      limit: 10,
      page: 0,
      ...userTypeData,
    };

    // if (
    //   JSON.parse(localStorage.getItem("product-focus-data")) &&
    //   JSON.parse(localStorage.getItem("product-focus-data"))?.offset
    // ) {
    //   const data = {
    //     ...JSON.parse(localStorage.getItem("product-focus-data")),
    //     offset: offset
    //       ? offset
    //       : JSON.parse(localStorage.getItem("product-focus-data"))?.offset,
    //     limit: ProductsListDataState?.productsData?.length
    //       ? ProductsListDataState?.productsData?.length
    //       : JSON.parse(localStorage.getItem("product-focus-data"))?.limit,
    //   };
    //   localStorage.setItem("product-focus-data", JSON.stringify(data));
    // }

    try {
      await dispatch(fetchProductsData(data1)).unwrap();
      // Handle response if needed
    } catch (error) {
      if (error?.status == 401 || error?.response?.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error?.status == "Network Error") {
        getNetworkError();
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    setDeleteCategoryId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    setDeleteloading(true);
    if (deleteCategoryId) {
      let timer = null;
      const formData = new FormData();
      formData.append("id", deleteCategoryId);
      formData.append("login_type", userTypeData?.login_type);
      formData.append("token_id", userTypeData?.token_id);
      formData.append("token", userTypeData?.token);
      formData.append(
        "merchant_id",
        LoginGetDashBoardRecordJson?.data?.merchant_id
      );

      try {
        const res = await dispatch(deleteProductAPI(formData)).unwrap();
        if (res?.status) {
          ToastifyAlert("Deleted Successfully", "success");
          setDeleteCategoryId(null);
          setDeleteModalOpen(false);
          clearTimeout(timer);
          timer = setTimeout(() => {
            window.location.reload();
          }, 600);
        }
      } catch (error) {
        if (error.status == 401 || error.response.status === 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status == "Network Error") {
          getNetworkError();
        }
      }
      setDeleteloading(false);
    }
  };

  const handleNavigate = (id, varientName, productData, productLength) => {
    let varientTitle = "";
    if (varientName?.includes("/")) {
      const splitVarient = varientName?.split("/");
      varientTitle = splitVarient?.join("-") || "";
    } else {
      varientTitle = varientName;
    }

    const encodedVarientTitle = encodeURIComponent(varientTitle); // Added this
    const encodedProductTitle = encodeURIComponent(productData?.title || ""); // Added this

    if (
      (selectedListingType === "Variant listing" || +listingUrl === 1) &&
      productData?.isvarient === "1"
    ) {
      return {
        link: `/inventory/products/varient-edit/${id}/${
          varientName ? encodedVarientTitle : null
        }?var_id=${productData?.var_id}&title=${encodedProductTitle}`,
        data: {
          offset: productLength,
          limit: productLength,
          productId: productData?.var_id ? productData?.var_id : id,
          variantName: varientName,
          from: window.location.href,
        },
      };
    } else {
      return {
        link: `/inventory/products/edit/${id}`,
        data: {
          offset: productLength,
          limit: productLength,
          productId: productData?.var_id ? productData?.var_id : id,
          variantName: varientName,
          from: window.location.href,
        },
      };
    }
  };

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // If no destination, or if dropped back in the original position, do nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to reorder this item?"
    );

    if (!userConfirmed) {
      return; // If user cancels, do nothing
    }

    // Reorder the items
    const reorderedItems = Array.from(productList);
    const removed = reorderedItems.splice(source.index, 1)[0];
    reorderedItems.splice(destination.index, 0, removed);

    setproductsList(reorderedItems);
    // Optionally, you can dispatch an action to update the order in your store

    // Example of how to prepare payload for API call

    const values = {};
    const payload = {
      table: "product",
      merchant_id: "MAL0100CA",
      token_id: 5022,
      login_type: "superadmin",
    };

    reorderedItems.forEach((item, index) => {
      values[`values[${item.id}]`] = item.title; // Adjust according to your data structure
    });

    // Example API call after successful reorder
    // Replace with your actual API call method (e.g., fetch or axios)

    try {
      // Send POST request using axios
      const response = await axios.post(
        BASE_URL + SORT_CATOGRY_DATA,
        { ...payload, ...values },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle API response
      ToastifyAlert("Reordered Successfully", "success");

      // Additional logic after successful reorder and API call
      // For example, update state or trigger additional actions
    } catch (error) {
      // Handle error scenarios
      ToastifyAlert("Error while reordering", "error");
      // Handle specific error cases if needed
    }
  };

  const renderLoader = () => {
    return (
      <TableContainer>
        <StyledTable aria-label="customized table">
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
              <StyledTableRow key={row}>
                {["", "", "", "", "", "", ""].map((col) => (
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
      <div className="box">
        <div className="q-category-bottom-detail-section" id="123">
          <div className="">
            <div className="q-category-bottom-header">
              <span>Products</span>
              <Link
                to="/inventory/products/add"
                state={{
                  from: window.location.href,
                }}
              >
                <p className="">
                  Add New Product
                  <img src={AddIcon} alt="add-icon" />
                </p>
              </Link>
            </div>
            <div
              style={{ marginTop: 0 }}
              className="q-category-bottom-detail-section"
            >
              <div className="q-category-bottom-header-sticky">
                <TableContainer>
                  <InfiniteScroll
                    dataLength={productList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                      <h4 className="all-product-list">{renderLoader()}</h4>
                    }
                    scrollableTarget="scrollableDiv"
                    endMessage={
                      loading ? (
                        <h3 className="all-product-list">{renderLoader()}</h3>
                      ) : !productList?.length ? (
                        <h3 className="all-product-list">
                          {!productList?.length && <NoDataFound table={true} />}
                        </h3>
                      ) : (
                        <h3 className="all-product-list"></h3>
                      )
                    }
                  >
                    {/* <DragDropContext onDragEnd={null}>
                      <Droppable droppableId="productTable">
                        {(provided) => ( */}
                    <StyledTable
                      sx={{ minWidth: 500 }}
                      aria-label="customized table"
                      // ref={provided.innerRef}
                      // {...provided.droppableProps}
                    >
                      <TableHead>
                        {selectedListingType === "Variant listing" ||
                        +listingUrl === 1 ||
                        LoginGetDashBoardRecordJson?.login_type !==
                          "superadmin" ? (
                          ""
                        ) : (
                          <StyledTableCell></StyledTableCell>
                        )}
                        {/* <StyledTableCell>Sort</StyledTableCell> */}
                        <StyledTableCell>Title</StyledTableCell>
                        {/* <StyledTableCell>Number of Variants</StyledTableCell> */}
                        <StyledTableCell>Category</StyledTableCell>
                        <StyledTableCell>
                          Enable online ordering?
                        </StyledTableCell>
                        <StyledTableCell>Product Status</StyledTableCell>
                        <StyledTableCell align={"center"}>
                          Images
                        </StyledTableCell>
                        {userTypeData?.login_type === "superadmin" &&
                        +listingUrl === 0 ? (
                          <StyledTableCell>Import Image</StyledTableCell>
                        ) : null}

                        {selectedListingType === "Variant listing" ||
                        +listingUrl === 1 ? (
                          ""
                        ) : (
                          <StyledTableCell>Delete</StyledTableCell>
                        )}
                      </TableHead>

                      <TableBody>
                        {productList?.length >= 1 &&
                          productList.map((product, index) => {
                            const getVarientName =
                              product?.title?.split(/~~?/) || [];
                            const navigateData = handleNavigate(
                              product.id,
                              getVarientName[1],
                              product,
                              productList?.length
                            );
                            return (
                              // <Draggable
                              //   key={product?.id}
                              //   draggableId={product?.id.toString()}
                              //   index={index}
                              // >
                              //   {(provided) => (
                              <StyledTableRow
                                key={product?.id}
                                id={`row-${
                                  product?.var_id
                                    ? product?.var_id
                                    : product?.id
                                }`}
                                loading="lazy"
                                // ref={provided.innerRef}
                                // {...provided.draggableProps}
                                // {...provided.dragHandleProps}
                              >
                                {selectedListingType === "Variant listing" ||
                                +listingUrl === 1 ||
                                LoginGetDashBoardRecordJson?.login_type !==
                                  "superadmin" ? (
                                  ""
                                ) : (
                                  <StyledTableCell>
                                    <label
                                      className="q_resigter_setting_section"
                                      style={{
                                        color: "#000",
                                        fontSize: "14px",
                                        padding: "0px",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        id={product.id}
                                        checked={productIdList?.includes(
                                          product?.id
                                        )}
                                        onChange={() => {
                                          productIdList?.includes(product?.id)
                                            ? handleProductUnCheck(product?.id)
                                            : handleProductCheck(product?.id);
                                        }}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </StyledTableCell>
                                )}
                                {/* <StyledTableCell>
                                  <img src={SortIcon} alt="" className="" />
                                </StyledTableCell> */}
                                <StyledTableCell>
                                  <p
                                    className="categories-title text-[#0A64F9]"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Link
                                      // target="_blank"
                                      to={navigateData?.link}
                                      state={navigateData?.data}
                                    >
                                      {product.title}
                                    </Link>
                                  </p>
                                  {+listingUrl === 0 ? (
                                    +product?.isvarient === 1 ? (
                                      <p
                                        className="categories-title"
                                        style={{
                                          cursor: "pointer",
                                          fontSize: "13px",
                                        }}
                                      >
                                        {product?.no_of_var} variants
                                      </p>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <BootstrapTooltip
                                    placement="bottom-start"
                                    title={
                                      <p className="capitalize">
                                        {product?.category_name}
                                      </p>
                                    }
                                  >
                                    <p className="categories-title">
                                      {product?.category_name
                                        ? `${(product?.category_name).slice(
                                            0,
                                            30
                                          )} ${
                                            product?.category_name.length > 30
                                              ? "..."
                                              : ""
                                          }`
                                        : ""}
                                    </p>
                                  </BootstrapTooltip>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="categories-title">
                                    <div className="flex flex-wrap gap-3 ">
                                      <label
                                        className="q_resigter_setting_section"
                                        style={{
                                          color: "#000",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Delivery
                                        <input
                                          type="checkbox"
                                          id={product.id}
                                          name="delivery_check"
                                          checked={
                                            product.show_type == 0 ||
                                            product.show_type == 2
                                              ? true
                                              : false
                                          }
                                          value={product.show_type}
                                          onChange={(event) => {
                                            Avail_Online(
                                              event,
                                              product?.show_type
                                            );
                                          }}
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                      <label
                                        className="q_resigter_setting_section"
                                        style={{
                                          color: "#000",
                                          fontSize: "14px",
                                        }}
                                      >
                                        Pickup
                                        <input
                                          type="checkbox"
                                          id={product.id}
                                          name="pickup_check"
                                          checked={
                                            product.show_type == 0 ||
                                            product.show_type == 1
                                              ? true
                                              : false
                                          }
                                          value={product.show_type}
                                          onChange={(event) => {
                                            Avail_Online(
                                              event,
                                              product?.show_type
                                            );
                                          }}
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                    </div>
                                  </div>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <p className="categories-title">
                                    {userTypeData?.login_type ===
                                      "superadmin" &&
                                    // inventoryApproval &&
                                    product?.show_status === "0" ? (
                                      <div className="categories-title">
                                        <div className="flex flex-wrap gap-3 ">
                                          <label
                                            className="q_resigter_setting_section"
                                            style={{
                                              color: "#000",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Approve
                                            <input
                                              type="checkbox"
                                              id={product.id}
                                              name="approved"
                                              checked={
                                                checkboxState[product.id]
                                                  ?.approved || false
                                              }
                                              value={product.show_status}
                                              onChange={(event) => {
                                                update_status(event, 1);
                                              }}
                                            />
                                            <span className="checkmark"></span>
                                          </label>
                                          <label
                                            className="q_resigter_setting_section"
                                            style={{
                                              color: "#000",
                                              fontSize: "14px",
                                            }}
                                          >
                                            Reject
                                            <input
                                              type="checkbox"
                                              id={product.id}
                                              name="reject"
                                              checked={
                                                checkboxState[product.id]
                                                  ?.rejected || false
                                              }
                                              value={product.show_status}
                                              onChange={(event) => {
                                                update_status(event, 2);
                                              }}
                                            />
                                            <span className="checkmark"></span>
                                          </label>
                                        </div>
                                      </div>
                                    ) : (
                                      <span
                                        style={{
                                          color: checkStatus(
                                            product.show_status.toString()
                                          )?.color,
                                        }}
                                      >
                                        {
                                          checkStatus(
                                            product.show_status.toString()
                                          )?.text
                                        }
                                      </span>
                                    )}
                                  </p>
                                </StyledTableCell>

                                <StyledTableCell align={"center"}>
                                  <div className="categories-items">
                                    <div className="flex items-center space-x-2 text-base"></div>
                                    <div className="mt-3 flex -space-x-9 overflow-hidden">
                                      {product?.media
                                        ?.split(",")
                                        .slice(0, 4)
                                        .map((item, index) => (
                                          <>
                                            <div className="relative">
                                              <img
                                                key={index}
                                                className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
                                                loading="lazy"
                                                src={
                                                  BASE_URL +
                                                  `upload/products/${LoginGetDashBoardRecordJson?.data?.merchant_id}/` +
                                                  item
                                                }
                                                onError={(e) => {
                                                  e.target.onerror = null; // prevents looping
                                                  e.target.src = `${BASE_URL}upload/products/MaskGroup4542.png`;
                                                }}
                                                alt=""
                                              />
                                              {index === 3 &&
                                              product?.media.split(",")
                                                ?.length > 4 ? (
                                                <div
                                                  className="flex justify-center items-center
                                                          absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                                                  style={{
                                                    backgroundColor:
                                                      "rgb(0 0 0 / 48%)",
                                                    height: "100%",
                                                    width: "100%",
                                                  }}
                                                >
                                                  <div>
                                                    <p className="text-white text-[10px]">
                                                      +
                                                      {product?.media.split(",")
                                                        .length - 4}
                                                    </p>
                                                    <p className="text-white text-[10px]">
                                                      Images
                                                    </p>
                                                  </div>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </>
                                        ))}
                                    </div>
                                  </div>
                                </StyledTableCell>
                                {userTypeData?.login_type === "superadmin" &&
                                +listingUrl === 0 ? (
                                  <>
                                    <StyledTableCell>
                                      <ImportImageModal
                                        productTitle={product.title}
                                        productId={product.id}
                                      />
                                    </StyledTableCell>
                                  </>
                                ) : null}

                                {selectedListingType === "Variant listing" ||
                                +listingUrl === 1 ? (
                                  ""
                                ) : (
                                  <StyledTableCell>
                                    {" "}
                                    <p
                                      className="w-10"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <img
                                        src={DeleteIcon}
                                        alt=" "
                                        className="w-8 h-8"
                                        onClick={() =>
                                          handleDeleteProduct(product?.id)
                                        }
                                      />
                                    </p>
                                  </StyledTableCell>
                                )}
                              </StyledTableRow>
                              //   )}
                              // </Draggable>
                            );
                          })}
                        {/* {provided.placeholder} */}
                      </TableBody>
                    </StyledTable>
                    {/* )} */}
                    {/* </Droppable> */}
                    {/* </DragDropContext> */}
                  </InfiniteScroll>
                </TableContainer>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        <DeleteModal
          headerText="Product"
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onConfirm={confirmDeleteCategory}
          deleteloading={deleteloading}
        />
      </div>
    </>
  );
};

export default memo(ProductTable);
