import { CircularProgress, Grid } from "@mui/material";
import AddSvg from "../../Assests/Dashboard/Left.svg";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
//       table imports ----------------------------------------------------
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";

// end table imports ----------------------------------------------------
import AsyncSelect from "react-select/async";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsData } from "../../Redux/features/Product/ProductSlice";
import { useAuthDetails } from "../../Common/cookiesHelper";
import axios from "axios";
import { BASE_URL, CREATE_UPDATE_STOCKTAKE } from "../../Constants/Config";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import DeleteModal from "../../reuseableComponents/DeleteModal";
import AlertModal from "../../reuseableComponents/AlertModal";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { fetchSingleStocktakeData } from "../../Redux/features/Stocktake/StocktakeListSlice";
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
    // backgroundColor: "#F5F5F5",
  },
  "& td, & th": {
    border: "none",
  },
}));

const StocktakeDropDownRow = ({
  index,
  singleStocktakeState,
  product,
  stocktake_items,
  loadProductOptions,
  customStyles,
  handleOnChangeSelectDropDown,
  handleClearDropdown,
  lastDropdownKey,
  errorMessages,
  handleNewQtyChange,
  handleKeyPress,
  DeleteIcon,
  handleDeleteProduct,
}) => {
  return (
    <StyledTableRow
      key={product.variant_id ? product.variant_id : product.product_id}
    >
      <StyledTableCell sx={{ width: "40%", verticalAlign: "top" }}>
        <div style={{ position: "relative", zIndex: 100 }}>
          {singleStocktakeState?.stocktake_item[index]?.product_id &&
          singleStocktakeState?.stocktake_item[index]?.product_id ===
            product.product_id ? (
            product?.product_name
          ) : (
            <AsyncSelect
              key={
                index === stocktake_items.length - 1 ? lastDropdownKey : index
              }
              isDisabled={stocktake_items.some(
                (item) =>
                  item.product_name !== "" &&
                  index !== stocktake_items.length - 1
              )}
              closeMenuOnSelect={true}
              loadOptions={loadProductOptions}
              defaultOptions
              styles={customStyles}
              menuPortalTarget={document.body}
              onChange={(option) => {
                handleOnChangeSelectDropDown(
                  option.prodId,
                  option.variantId,
                  index
                );
                // Only trigger re-render for the last dropdown
                if (index === stocktake_items.length - 1) {
                  handleClearDropdown(); // Call this only for the last one
                }
              }}
              value={{
                label: product && product?.product_name,
                value:
                  product.isvarient === "1" ? product?.var_id : product?.id,
              }}
            />
          )}
          {errorMessages[index]?.product_name && (
            <div className="error-message-stocktake">
              {errorMessages[index].product_name}
            </div>
          )}
        </div>
      </StyledTableCell>
      <StyledTableCell sx={{ verticalAlign: "top" }}>
        {product.current_qty}
      </StyledTableCell>
      <StyledTableCell sx={{ width: "20%", verticalAlign: "top" }}>
        <BasicTextFields
          value={product.new_qty}
          maxLength={6}
          onChangeFun={(e) => {
            handleNewQtyChange(e, index);
          }}
          onKeyPressFun={handleKeyPress}
          autoComplete={false}
        />
        {errorMessages[index]?.new_qty && (
          <div className="error-message-stocktake">
            {errorMessages[index].new_qty}
          </div>
        )}
      </StyledTableCell>
      <StyledTableCell sx={{ verticalAlign: "top" }}>
        {product.discrepancy}
      </StyledTableCell>
      <StyledTableCell sx={{ verticalAlign: "top" }}>
        {product.upc}
      </StyledTableCell>
      <StyledTableCell sx={{ verticalAlign: "top" }}>
        {stocktake_items.length === 1 ? null : (
          <img
            src={DeleteIcon}
            onClick={() => handleDeleteProduct(index)}
            alt="Delete Icon"
            className="cursor-pointer"
          />
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

const AddNewStocktake = () => {
  const [lastDropdownKey, setLastDropdownKey] = useState(0);

  const handleClearDropdown = () => {
    setLastDropdownKey((prevKey) => prevKey + 1);
    loadProductOptions(""); // Optionally, reload options if necessary
  };
  const { LoginGetDashBoardRecordJson, userTypeData } = useAuthDetails();
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  const singleStocktakeStateFromRedux = useSelector(
    (state) => state.stocktakeList
  );

  const [singleStocktakeState, setSingleStocktakeState] = useState();
  const [deletedSingleStocktakeState, setDeletedSingleStocktakeState] =
    useState([]);
  const [gotDatafromPo, setDataFromPo] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [gotSelectedProducts, setGotSelectedProducts] = useState(false);
  const [stocktake_items, setProductList] = useState([
    {
      upc: "",
      category_id: "",
      product_id: "",
      variant_id: "",
      product_name: "",
      variant: "",
      current_qty: "",
      new_qty: "",
      discrepancy: "",
      discrepancy_cost: "0",
      stocktake_item_id: "",
      price: "",
    },
  ]);
  const location = useLocation();

  const { id } = useParams();

  useEffect(() => {
    if (id && location.pathname !== "/stocktake/AddStocktake") {
      dispatch(fetchSingleStocktakeData({ merchant_id, id, userTypeData }));
    }
  }, [id]);

  useEffect(() => {
    if (
      !singleStocktakeStateFromRedux.loading &&
      singleStocktakeStateFromRedux.singleStocktakeState &&
      location.pathname !== "/stocktake/AddStocktake"
    ) {
      setSingleStocktakeState(
        singleStocktakeStateFromRedux.singleStocktakeState
      );
    }
  }, [
    singleStocktakeStateFromRedux.loading,
    singleStocktakeStateFromRedux.singleStocktakeState,
  ]);

  useEffect(() => {
    if (
      !singleStocktakeStateFromRedux.loading &&
      singleStocktakeStateFromRedux.gotDatafromPo
    ) {
      setDataFromPo(singleStocktakeStateFromRedux.gotDatafromPo);
    }
  }, [
    singleStocktakeStateFromRedux.loading,
    singleStocktakeStateFromRedux.gotDatafromPo,
  ]);

  useEffect(() => {
    if (singleStocktakeState && !gotSelectedProducts) {
      const newStocktakeItems = singleStocktakeState?.stocktake_item.map(
        (item, index) => ({
          upc: item.upc || "", //
          category_id: item.category_id || "", //
          product_id: item.product_id || "", //
          variant_id: item.variant_id || "", //
          product_name: item.product_name || "", //
          variant: item.variant || "", //
          current_qty: item.current_qty || "", //
          new_qty: item.new_qty || "", //
          discrepancy: item.discrepancy || "", //
          discrepancy_cost: item.discrepancy_cost || "0", //
          stocktake_item_id: item.id || "",
          price: gotDatafromPo[index]?.price || "",
        })
      );
      setProductList(newStocktakeItems);
      setGotSelectedProducts(true);
    }
  }, [singleStocktakeState]);

  const loadProductOptions = async (inputValue) => {
    let name_data = {
      merchant_id: merchant_id,
      category_id: "all",
      show_status: "all",
      listing_type: 1,
      offset: 0,
      limit: 25,
      name: inputValue,
      page: 0,
      ...userTypeData,
    };

    const res = await dispatch(fetchProductsData(name_data));
    setSelectedProducts(res.payload);

    const data = res.payload?.map((prod) => ({
      label: prod.title,
      value: prod.id,
      variantId: prod.isvarient === "1" ? prod.var_id : null,
      prodId: prod.id,
    }));

    const temp = data?.filter((prod) => {
      const productFound = stocktake_items?.find((product) => {
        const a =
          (product?.variant && product.variant_id == prod.variantId) ||
          (!product.variant && product.product_id == prod.value);
        return a;
      });

      // (product) =>
      //   (product.id &&
      //     product.product_id &&
      //     product.id === prod.variantId &&
      //     product.product_id === prod.value) ||
      //   (product.id && !product.product_id && product.id === prod.value)

      return !productFound;
    });
    return temp;
  };
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [StocktakeStaus, setStocktakeStaus] = useState();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalHeaderText, setAlertModalHeaderText] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const validate = () => {
    const errors = [];
    let isValid = true;
    stocktake_items.forEach((item, index) => {
      const itemErrors = {};
      if (!item.product_name) {
        itemErrors.product_name = "Please select item.";
        isValid = false;
      }
      if (!item.new_qty) {
        itemErrors.new_qty = "Please enter new quantity.";
        isValid = false;
      }
      errors[index] = itemErrors;
    });
    setErrorMessages(errors);
    return isValid;
  };
  const showModal = (headerText) => {
    setAlertModalHeaderText(headerText);
    setAlertModalOpen(true);
  };

  const handleAddProduct = () => {
    if (validate()) {
      setProductList([
        ...stocktake_items,
        {
          upc: "",
          category_id: "", //
          product_id: "",
          variant_id: "",
          product_name: "", //
          variant: "",
          current_qty: "",
          new_qty: "",
          discrepancy: "0",
          discrepancy_cost: "0",
          stocktake_item_id: "",
          price: "",
        },
      ]);
      setErrorMessages([]);
    }
  };

  const handleDeleteProduct = (index) => {
    setDeleteCategoryId(index);
    setDeleteModalOpen(true);
  };
  const confirmDeleteCategory = async () => {
    // Check if the singleStocktakeState object and stocktake_item array are present
    if (
      !singleStocktakeState ||
      !singleStocktakeState.stocktake_item ||
      singleStocktakeState.stocktake_item.length === 0
    ) {
      // If singleStocktakeState or stocktake_item array is empty, filter the stocktake_items array and update the state
      const newList = stocktake_items.filter((_, i) => i !== deleteCategoryId);
      const newList1 = newList.filter((product) => product.product_name !== "");
      setProductList(newList);
      // Close the delete modal
      setDeleteModalOpen(false);
      return;
    }

    // try {
    const { token, ...otherUserData } = userTypeData;
    const filteredStocktakeItems = singleStocktakeState.stocktake_item.filter(
      (_, i) => i !== deleteCategoryId
    );

    const total_qty = filteredStocktakeItems.reduce(
      (sum, item) => sum + Number(item.new_qty || 0),
      0
    );
    const total_discrepancy_cost = filteredStocktakeItems.reduce(
      (sum, item) => sum + Number(item.discrepancy_cost || 0),
      0
    );
    const total_discrepancy = filteredStocktakeItems.reduce(
      (sum, item) => sum + Number(item.discrepancy || 0),
      0
    );

    // Check if the item to be deleted is in the original stocktake_item list
    const itemToDelete = stocktake_items[deleteCategoryId];

    const isOriginalItem = singleStocktakeState.stocktake_item.some(
      (item) => item.id === itemToDelete.stocktake_item_id
    );

    if (isOriginalItem) {
      const formData = {
        merchant_id: merchant_id,
        stocktake_id: singleStocktakeState.id,
        stocktake_item_id: itemToDelete.stocktake_item_id,
        total_qty,
        total_discrepancy,
        total_discrepancy_cost: total_discrepancy_cost.toFixed(2),
      };
      setDeletedSingleStocktakeState([
        ...deletedSingleStocktakeState,
        formData,
      ]);

      const newList = stocktake_items.filter((_, i) => i !== deleteCategoryId);

      setProductList(newList);
      setSingleStocktakeState({
        ...singleStocktakeState,
        stocktake_item: filteredStocktakeItems,
        total_qty: total_qty,
        total_discrepancy: total_discrepancy,
        total_discrepancy_cost: total_discrepancy_cost,
      });

      ToastifyAlert("Deleted Successfully", "success");
    } else {
      const newList = stocktake_items.filter((_, i) => i !== deleteCategoryId);
      setProductList(newList);
    }
    setDeleteCategoryId(null);
    setDeleteModalOpen(false);
  };

  const handleNewQtyChange = (e, index) => {
    const { value } = e.target;
    const isValidQty =
      value === "" || value === "0" || /^[1-9]\d*$/.test(value);
    if (!isValidQty) {
      setErrorMessages((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[index] = {
          ...updatedErrors[index],
          new_qty: "Invalid quantity. Please enter a valid number.",
        };
        return updatedErrors;
      });
      return;
    }
    setProductList((prevList) => {
      const updatedList = [...prevList];
      const currentQty = updatedList[index].current_qty;
      const newQty = value;
      const unitPrice = updatedList[index]?.costperItem;
      const parsedCurrentQty = parseInt(currentQty);
      const discrepancy = newQty
        ? parseInt(newQty) - parseInt(parsedCurrentQty)
        : 0;
      const discrepancyCost = discrepancy * unitPrice;

      updatedList[index] = {
        ...updatedList[index],
        new_qty: newQty,
        discrepancy: discrepancy,
        discrepancy_cost: discrepancyCost,
      };
      return updatedList;
    });
    setErrorMessages((prevErrors) => {
      const updatedErrors = [...prevErrors];
      if (!value) {
        updatedErrors[index] = {
          ...updatedErrors[index],
          new_qty: "Please enter new quantity.",
        };
      } else {
        delete updatedErrors[index]?.new_qty;
      }
      return updatedErrors;
    });
  };
  const handleOnChangeSelectDropDown = async (productId, variantId, index) => {
    try {
      const { token, ...otherData } = userTypeData;
      const formData = {
        merchant_id: merchant_id,
        id: productId,
        ...otherData,
      };
      const response = await axios.post(
        BASE_URL + "Product_api_react/get_productdata_ById",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let obj = {
        notes: "",
        newQty: "",
        newPrice: "",
        finalPrice: "0.00",
        finalQty: 0,
      };

      if (response.data.status) {
        if (variantId && response.data.data.product_variants.length > 0) {
          const product = response.data.data.product_variants.find(
            (prod) => prod.id === variantId
          );

          obj.newPrice =
            parseFloat(product.price) > 0 ? parseFloat(product.price) : 0;
          obj.finalQty = Number(product.quantity) ?? 0;
          const sortedProduct = selectedProducts.find(
            (prod) => prod.var_id === product.id
          );
          setProductList((prevList) => {
            const updatedList = [...prevList];
            updatedList[index] = {
              ...updatedList[index],
              upc: product?.upc || "", //
              category_id: sortedProduct?.cotegory || "", //
              product_id: product?.product_id || "", //
              variant_id: product?.id || "", //
              product_name: sortedProduct?.title || "", //
              variant: product?.variant || "", //
              current_qty: product?.quantity || "", //
              stocktake_item_id: "0" || "",
              price: product?.price || "",
              costperItem: product?.costperItem || "",
              new_qty: "",
              discrepancy: "0",
            };

            return updatedList;
          });
        } else {
          const product = response.data.data.productdata;

          obj.newPrice =
            parseFloat(product.price) > 0 ? parseFloat(product.price) : 0;
          obj.finalQty = Number(product.quantity) ?? 0;
          setProductList((prevList) => {
            const updatedList = [...prevList];
            updatedList[index] = {
              ...updatedList[index],
              upc: product.upc || "", //
              category_id: selectedProducts[0]?.cotegory || "", //
              product_id: product.id || "", //
              product_name: product.title || "", //
              current_qty: product.quantity || "", //
              stocktake_item_id: "0" || "",
              price: product?.price || "",
              costperItem: product?.costperItem || "",
              new_qty: "",
              discrepancy: "0",
              variant_id: "",
              variant: "",
            };

            return updatedList;
          });
        }
      } else {
        console.log("Product Not available!");
      }
    } catch (e) {
      console.log("e: ", e);
    }
    setErrorMessages((prevErrors) => {
      const updatedErrors = [...prevErrors];
      if (!productId) {
        updatedErrors[index] = {
          ...updatedErrors[index],
          product_name: "Please select item.",
        };
      } else {
        delete updatedErrors[index]?.product_name;
      }
      return updatedErrors;
    });
  };
  const handleCreateStocktake = async (stocktakeStatus) => {
    setStocktakeStaus(stocktakeStatus);
    if (stocktake_items.length === 0) {
      showModal("List cannot be empty !");
      return;
    }
    if (validate()) {
      try {
        const { token, ...otherUserData } = userTypeData;
        await Promise.all(
          deletedSingleStocktakeState.map(async (stocktake) => {
            const response = axios.post(
              BASE_URL + "Stocktake_react_api/delete_stocktake_item",
              { ...stocktake, ...otherUserData },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.status === 200) {
            }
          })
        );

        const total_qty = stocktake_items.reduce(
          (sum, item) => sum + Number(item.new_qty || 0),
          0
        );
        const total_discrepancy_cost = stocktake_items.reduce(
          (sum, item) => sum + Number(item.discrepancy_cost || 0),
          0
        );
        const total_discrepancy = stocktake_items.reduce(
          (sum, item) => sum + Number(item.discrepancy || 0),
          0
        );
        const padToTwoDigits = (num) => num.toString().padStart(2, "0");
        const formatDateTime = (date) => {
          const year = date.getFullYear();
          const month = padToTwoDigits(date.getMonth() + 1);
          const day = padToTwoDigits(date.getDate());
          const hours = padToTwoDigits(date.getHours());
          const minutes = padToTwoDigits(date.getMinutes());
          const seconds = padToTwoDigits(date.getSeconds());
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        const datetime = formatDateTime(new Date());
        const numberParseTofloat = stocktake_items.map((item) => {
          return { ...item, discrepancy: parseFloat(item.discrepancy) };
        });
        const updatedStocktakeItem = numberParseTofloat?.reduce(
          (acc, curr, index) => {
            acc[index] = curr;
            return acc;
          },
          {}
        );
        const stocktakeData = {
          merchant_id: merchant_id, //
          total_qty,
          total_discrepancy_cost: total_discrepancy_cost.toFixed(2),
          total_discrepancy, //
          status: stocktakeStatus,
          datetime: datetime,
          stocktake_items: JSON.stringify(updatedStocktakeItem),
          stocktake_id: singleStocktakeState ? singleStocktakeState.id : "0", //
        };

        setLoader(true);

        const response = await axios.post(
          BASE_URL + CREATE_UPDATE_STOCKTAKE,
          { ...stocktakeData, ...otherUserData },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          ToastifyAlert("Updated Successfully", "success");
          setLoader(false);
        } else {
          ToastifyAlert(response.data.message, "error");
          setLoader(false);
        }
      } catch (error) {
        console.error("Error creating stocktake:", error);
        setLoader(false);
      }

      navigate(-1);
    }
  };
  const handleCancelBtn = () => {
    const isItemInvalid = (item) => {
      if (!item.product_name) {
        showModal("Product name cannot be empty!");
        return true;
      }
      if (!item.new_qty) {
        showModal("New quantity cannot be empty!");
        return true;
      }
      return false;
    };

    if (singleStocktakeState?.stocktake_item?.length === 0) {
      showModal("List cannot be empty!");
      return;
    }

    if (
      singleStocktakeState?.stocktake_item?.length === 1 &&
      isItemInvalid(singleStocktakeState?.stocktake_item[0])
    ) {
      return;
    }

    navigate(-1);
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "black" : provided.borderColor,
      boxShadow: state.isFocused ? "0 0 0 1px black" : provided.boxShadow,
      height: 40,
      cursor: "pointer",
      minHeight: 40,
      "&:hover": {
        borderColor: "black" ? "black" : provided["&:hover"].borderColor,
      },
    }),
    input: (provided) => ({
      ...provided,
      "&:focus": {
        borderColor: "black",
        outline: "none",
      },
    }),
  };

  const handleKeyPress = (e) => {
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Grid container className="box_shadow_div">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <div className="q-add-categories-section-header">
                <span
                  onClick={handleCancelBtn}
                  className="text-center items-center"
                >
                  <img src={AddSvg} />
                  <span>
                    {singleStocktakeState ? "Update" : "New"} Stocktake
                  </span>
                  <p className="px-2">
                    {singleStocktakeState && singleStocktakeState?.st_id}
                  </p>
                </span>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ py: 2.5 }}>
          <Grid item xs={12}>
            <TableContainer>
              <StyledTable aria-label="customized table">
                <TableHead>
                  <StyledTableCell>Product Name</StyledTableCell>
                  <StyledTableCell>Current Qty</StyledTableCell>
                  <StyledTableCell>New Qty</StyledTableCell>
                  <StyledTableCell>Discrepancy</StyledTableCell>
                  <StyledTableCell>UPC</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableHead>
                <TableBody>
                  {stocktake_items.map((product, index) => {
                    return (
                      <StocktakeDropDownRow
                        index={index}
                        singleStocktakeState={singleStocktakeState}
                        product={product}
                        stocktake_items={stocktake_items}
                        loadProductOptions={loadProductOptions}
                        customStyles={customStyles}
                        handleOnChangeSelectDropDown={
                          handleOnChangeSelectDropDown
                        }
                        handleClearDropdown={handleClearDropdown}
                        lastDropdownKey={lastDropdownKey}
                        errorMessages={errorMessages}
                        handleNewQtyChange={handleNewQtyChange}
                        handleKeyPress={handleKeyPress}
                        DeleteIcon={DeleteIcon}
                        handleDeleteProduct={handleDeleteProduct}
                      />
                    );
                  })}
                </TableBody>
              </StyledTable>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2.5 }}
        >
          <Grid item>
            <Grid container spacing={3}>
              <Grid item>
                <button
                  onClick={handleCancelBtn}
                  className="quic-btn quic-btn-cancle w-32"
                >
                  Cancel
                </button>
              </Grid>
              <Grid item>
                <button
                  className="quic-btn quic-btn-save w-32"
                  onClick={handleAddProduct}
                >
                  Add
                </button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={3}>
              <Grid item>
                <button
                  onClick={() => {
                    handleCreateStocktake("1");
                  }}
                  className="quic-btn quic-btn-save w-48"
                  disabled={loader}
                >
                  {loader && StocktakeStaus === "1" ? (
                    <CircularProgress
                      color={"inherit"}
                      className=""
                      width={15}
                      size={15}
                    />
                  ) : (
                    "Save as Draft"
                  )}
                </button>
              </Grid>
              <Grid item>
                <button
                  className="quic-btn quic-btn-save w-32"
                  onClick={() => {
                    handleCreateStocktake("0");
                  }}
                  disabled={loader}
                >
                  {loader && StocktakeStaus === "0" ? (
                    <CircularProgress
                      color={"inherit"}
                      className=""
                      width={15}
                      size={15}
                    />
                  ) : (
                    "Create"
                  )}
                </button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DeleteModal
        headerText="Stocktake"
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={confirmDeleteCategory}
      />
      <AlertModal
        headerText={alertModalHeaderText}
        open={alertModalOpen}
        onClose={() => {
          setAlertModalOpen(false);
        }}
      />
    </>
  );
};

export default AddNewStocktake;
