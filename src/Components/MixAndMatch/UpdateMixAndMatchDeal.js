import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import SwitchToBackButton from "../../reuseableComponents/SwitchToBackButton";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import SearchableDropdown from "../../CommonComponents/SearchableDropdown";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { useDispatch } from "react-redux";
import { fetchProductsData } from "../../Redux/features/Product/ProductSlice";
import PasswordShow from "../../Common/passwordShow";
import { useSelector } from "react-redux";
import { handleInputNumber, isValidNumber } from "../../Constants/utils";
import {
  clearSingleMixAndMatchDeal,
  mixAndMatchPricingDealsList,
  singleMixAndMatchPricingDeal,
  updateMixAndMatchpricingDeal,
} from "../../Redux/features/MixAndMatch/mixAndMatchSlice";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import useDebounce from "../../hooks/useDebouncs";

const UpdateMixAndMatchDeal = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userTypeData, LoginGetDashBoardRecordJson } = useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const { mixAndMatchDeals, singleMixAndMatchDeal } = useSelector(
    (state) => state.mixAndMatchList
  );

  const [productOptions, setProductOptions] = useState([]); // for products list dropdown after all filters
  const [products, setProducts] = useState([]); // api response products
  const [productName, setProductName] = useState(""); // products dropdown input value
  const debouncedValue = useDebounce(productName);
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // actual updated deal
  const [updatedDeal, setUpdatedDeal] = useState({
    title: "",
    description: "",
    products: [],
    minQty: "",
    discount: "",
    isPercent: "0",
  });

  const [error, setError] = useState({
    title: "",
    products: "",
    minQty: "",
    discount: "",
  });

  // fetching products data
  useEffect(() => {
    const fetchProducts = async () => {
      let data = {
        merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
        format: "json",
        category_id: "all",
        show_status: "all",
        name: debouncedValue,
        listing_type: 1,
        offset: 0,
        limit: 50,
        page: 0,
        ...userTypeData,
      };

      try {
        setOptionsLoading(true);
        const productsData = await dispatch(fetchProductsData(data)).unwrap();
        // console.log("api productsData: ", productsData);
        setProducts(() => productsData);
      } catch (error) {
        if (error.status === 401 || error.response.status === 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status === "Network Error") {
          getNetworkError();
        }
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchProducts();
  }, [debouncedValue]);

  // setting dropdown product options via api
  useEffect(() => {
    // filtering based on the price & discount
    const productsList = products.filter((product) =>
      updatedDeal.isPercent === "0"
        ? parseFloat(product.price) >= updatedDeal.discount
        : product
    );
    setProductOptions(productsList);
  }, [products, updatedDeal.isPercent, updatedDeal.discount]);

  // setting default data for the current deal selected
  useEffect(() => {
    if (singleMixAndMatchDeal && singleMixAndMatchDeal.length > 0) {
      const deal = singleMixAndMatchDeal[0];
      // console.log("single deal: ", deal);

      if (deal.id !== dealId) {
        return;
      }

      const items = deal.items_names;
      let defaultProducts = [];
      for (let item in items) {
        const newItem = items[item];
        newItem.forEach((element) => {
          const obj = {
            id: item,
            var_id: element.id === item ? null : element.id,
            isvarient: element.id === item ? "0" : "1",
            title: element.name,
            price: element.price,
          };
          defaultProducts.push(obj);
        });
      }

      if (selectedProducts.length <= 0 && defaultProducts.length > 0) {
        setSelectedProducts(defaultProducts);
      }

      // console.log("setting default products: ", selectedProducts);
      const dealData = {
        title: deal.deal_name || "",
        products: selectedProducts,
        minQty: deal.min_qty || "0",
        discount: deal.discount || "0.00",
        isPercent: deal.is_percent || "0",
        isEnable: deal.is_enable || "0",
      };
      // console.log("deal data: ", dealData);
      setUpdatedDeal(dealData);
    }
  }, [singleMixAndMatchDeal, selectedProducts]);

  // filter products by discount
  const filterByDiscount = (productsData) => {
    const data = productsData.filter((product) => {
      const result =
        updatedDeal.isPercent === "0"
          ? parseFloat(product.price) >= (parseFloat(updatedDeal.discount) || 0)
          : product;

      return result;
    });

    return data;
  };

  // removing products from already Selected Products whose price is less than discount price
  useEffect(() => {
    if (updatedDeal.products.length > 0) {
      const temp =
        updatedDeal.isPercent === "0"
          ? filterByDiscount(updatedDeal.products)
          : updatedDeal.products;

      // console.log("new default selected product: ", temp);
      setUpdatedDeal((prev) => ({
        ...prev,
        products: temp,
      }));
    }
  }, [updatedDeal.isPercent, updatedDeal.discount]);

  // filtering dropdown Products Options
  useEffect(() => {
    const filterProducts = (productsList) => {
      let temp = [];

      // only passing all other deals except the current one.
      const otherMixAndMatchDeals =
        mixAndMatchDeals &&
        mixAndMatchDeals.length > 0 &&
        mixAndMatchDeals.filter((deal) => deal.id !== dealId);

      if (otherMixAndMatchDeals && otherMixAndMatchDeals.length > 0) {
        const data = productsList.filter((product) => {
          let alreadyInDeal = false;
          for (let i = 0; i < otherMixAndMatchDeals.length; i++) {
            const itemsIdObject = JSON.parse(
              otherMixAndMatchDeals[i]?.items_id
            );
            for (let key in itemsIdObject) {
              // if product is a variant product
              if (
                product.isvarient === "1" &&
                key === product.id &&
                itemsIdObject[key].includes(product.var_id)
              ) {
                alreadyInDeal = true;
              }

              // if product is not a variant product
              if (product.isvarient === "0" && key === product.id) {
                alreadyInDeal = true;
              }
            }
          }

          return !alreadyInDeal;
        });

        temp = updatedDeal.isPercent === "0" ? filterByDiscount(data) : data;
      } else {
        temp =
          updatedDeal.isPercent === "0"
            ? filterByDiscount(productsList)
            : productsList;
      }

      return temp;
    };

    // removing products from Product Options whose price is less than discount price
    if (products && products.length > 0) {
      const temp = filterProducts(products);
      setProductOptions(() => temp);
      // console.log("2nd update... ", temp);
    }
  }, [updatedDeal.discount, products, updatedDeal.isPercent, mixAndMatchDeals]);

  // on load fetching details of the Deal
  useEffect(() => {
    const getDealInfo = async () => {
      try {
        const allDeals = {
          ...userTypeData,
          merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
        };
        const singleDeal = {
          ...userTypeData,
          merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
          mix_id: dealId,
        };

        await dispatch(mixAndMatchPricingDealsList(allDeals)).unwrap();
        await dispatch(singleMixAndMatchPricingDeal(singleDeal)).unwrap();
      } catch (error) {
        if (error.status == 401) {
          handleCoockieExpire();
          getUnAutherisedTokenMessage();
        }
      }
    };

    getDealInfo();

    return () => {
      // console.log("going bye...");
      dispatch(clearSingleMixAndMatchDeal());
      setProducts([]);
      setProductOptions([]);
      setUpdatedDeal({
        title: "",
        description: "",
        products: [],
        minQty: "",
        discount: "",
        isPercent: "0",
      });
    };
  }, [dealId]);

  // handling description
  useEffect(() => {
    const description = `Buy ${updatedDeal.minQty || 0} get ${
      updatedDeal.isPercent === "1"
        ? `${updatedDeal.discount || "0"}%`
        : `$${updatedDeal.discount || "0.00"}`
    } off each`;

    setUpdatedDeal((prev) => ({ ...prev, description }));
  }, [updatedDeal.discount, updatedDeal.isPercent, updatedDeal.minQty]);

  // Common Input handler function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDeal((prev) => ({ ...prev, [name]: value }));
  };

  // Tab changing handler - Discount Amount & Discount Percentage
  const handleTabChange = (type) => {
    setUpdatedDeal((prev) => ({
      ...prev,
      isPercent: type === "amount" ? "0" : "1",
      discount: type === "amount" ? "0.00" : "0",
    }));
  };

  // Selecting a Product
  const handleSelectProductOptions = (value, name) => {
    setUpdatedDeal((prev) => ({
      ...prev,
      [name]: [...prev[name], value],
    }));
  };

  // Deleting a Selected Option
  const handleDeleteSelectedOption = (id, name, opt) => {
    setProductOptions((prev) => {
      const alreadyExists = prev.find((item) =>
        opt.var_id
          ? opt.var_id === item.var_id && item.id === opt.id
          : item.id === opt.id
      );
      if (!alreadyExists) {
        return [opt, ...prev];
      } else {
        return prev;
      }
    });
    const filterOptionItems = updatedDeal[name].filter((item) =>
      item.isvarient === "1" ? item.var_id !== opt.var_id : item?.id !== id
    );

    setUpdatedDeal((prev) => ({
      ...prev,
      [name]: filterOptionItems,
    }));
  };

  const handleUpdateError = (updatedErrorValue) => {
    setError((prev) => ({
      ...prev,
      ...updatedErrorValue,
    }));
  };

  // updating the Deal
  const updateDeal = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const { title, products, minQty, discount, isPercent, description } =
        updatedDeal;

      // const duplicateDealName = mixAndMatchDeals.find(
      //   ({ id, deal_name }) => id !== dealId && deal_name === title
      // );

      // if (duplicateDealName) {
      //   setError((prev) => ({
      //     ...prev,
      //     title: "Deal name already exists",
      //   }));
      //   return;
      // }

      if (
        Boolean(title.trim()) &&
        minQty > 0 &&
        parseFloat(discount) > 0 &&
        products.length > 0
      ) {
        const items = {};
        products.forEach((item) => {
          if (item.isvarient === "1") {
            if (items[item.id]) {
              items[item.id] = [...items[item.id], item.var_id];
            } else {
              items[item.id] = [item.var_id];
            }
          } else {
            items[item.id] = "";
          }
        });

        const data = {
          merchant_id: LoginGetDashBoardRecordJson?.data?.merchant_id,
          deal_name: title,
          min_qty: minQty,
          description,
          discount,
          is_percent: isPercent,
          items_id: JSON.stringify(items),
          is_enable: updatedDeal?.isEnable || "0",
          mix_id: dealId,
          ...userTypeData,
        };

        // console.log("data: ", data);

        const result = await dispatch(
          updateMixAndMatchpricingDeal(data)
        ).unwrap();
        // console.log("result: ", result);
        if (result.status) {
          ToastifyAlert(result.message, "success");
          navigate("/mix-and-match");
        } else {
          ToastifyAlert(result.message, "error");
        }
      } else {
        setError((prev) => ({
          ...prev,
          title: !title ? "Deal name is required!" : "",
          products: products.length <= 0 ? "Products are required!" : "",
          minQty: !minQty || minQty <= 0 ? "Minimum quantity is required!" : "",
          discount:
            !discount || parseFloat(discount) <= 0
              ? "Discount per item is required"
              : "",
        }));
      }
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <div className="box_shadow_div">
        <div className="q-add-categories-section">
          <SwitchToBackButton linkTo={"/mix-and-match"} title={"Update Deal"} />
          <form onSubmit={updateDeal}>
            <div className="q-add-categories-section-middle-form">
              <div className="q-add-coupon-single-input mb-4">
                <label htmlFor="coupon_name">Deal Name</label>
                <div className="input_area" style={{ marginBottom: "0px" }}>
                  <BasicTextFields
                    type={"text"}
                    maxLength={100}
                    value={updatedDeal.title}
                    name="title"
                    onChangeFun={handleInputChange}
                  />
                </div>
                {error.title && <p className="error-message">{error.title}</p>}
              </div>

              <div className="q-add-coupon-single-input mb-6">
                <label htmlFor="description">Description</label>
                <div
                  className="input_area read-only-input-field"
                  style={{ marginBottom: "0px" }}
                >
                  <BasicTextFields
                    type={"text"}
                    value={updatedDeal.description}
                    name="description"
                    readOnly={true}
                  />
                </div>
              </div>

              <Grid container spacing={2}>
                <Grid item md={5} xs={12}>
                  <div className="q_coupon_minium input_area">
                    <label htmlFor="minorder_amt">Minimum Quantity</label>
                    <BasicTextFields
                      type={"text"}
                      maxLength={6}
                      value={updatedDeal.minQty}
                      onChangeFun={(e) => {
                        if (isValidNumber(Number(e.target.value))) {
                          handleInputNumber(e, setUpdatedDeal, updatedDeal);
                        }
                      }}
                      placeholder="Enter Minimum Quantity"
                      name="minQty"
                    />
                    {error.minQty && (
                      <p className="error-message">{error.minQty}</p>
                    )}
                  </div>
                </Grid>
                <Grid item md={7} xs={12}>
                  <div className="q_coupon_minium  dicount_per_amo">
                    <Grid container>
                      <Grid item xs={5}>
                        <div className="q_coupon_minium input_area">
                          <label htmlFor="discount_amt">
                            Discount Per Item (
                            {updatedDeal.isPercent === "1" ? "%" : "$"})
                          </label>
                          <BasicTextFields
                            type={"text"}
                            maxLength={9}
                            value={updatedDeal.discount}
                            onChangeFun={(e) =>
                              handleInputNumber(e, setUpdatedDeal, updatedDeal)
                            }
                            placeholder="Enter Discount Amount"
                            name="discount"
                          />

                          {error.discount && (
                            <p className="error-message">{error.discount}</p>
                          )}
                        </div>
                      </Grid>

                      <Grid item xs={7}>
                        <div className="AMT_PER_button">
                          <Grid container>
                            <Grid item xs={6}>
                              <div
                                className={`cursor-pointer amt_btn text-center   ${
                                  updatedDeal.isPercent === "0"
                                    ? "bg-[#0A64F9] text-white radius-4"
                                    : ""
                                }`}
                                onClick={() => handleTabChange("amount")}
                              >
                                Amount ($)
                              </div>
                            </Grid>
                            <Grid item xs={6}>
                              <div
                                className={`cursor-pointer amt_btn text-center  ${
                                  updatedDeal.isPercent === "1"
                                    ? "bg-[#0A64F9] text-white radius-4"
                                    : ""
                                }`}
                                style={{ whiteSpace: "nowrap" }}
                                onClick={() => handleTabChange("percentage")}
                              >
                                Percentage (%)
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="q-add-categories-single-input">
                    <SearchableDropdown
                      title="Products"
                      keyName="products"
                      name="title"
                      optionList={productOptions}
                      handleSelectProductOptions={handleSelectProductOptions}
                      handleDeleteSelectedOption={handleDeleteSelectedOption}
                      selectedOption={updatedDeal?.products}
                      error={error}
                      handleUpdateError={handleUpdateError}
                      placeholder="Search Products"
                      usingFor="variantProducts"
                      setProductName={setProductName}
                      optionsLoading={optionsLoading}
                      errorClass="error-message"
                    />
                  </div>
                </Grid>
              </Grid>
            </div>

            <div className="q-add-categories-section-middle-footer">
              <button className="quic-btn quic-btn-save" disabled={loading}>
                {" "}
                {loading ? (
                  <>
                    <CircularProgress color={"inherit"} width={15} size={15} />{" "}
                    Update
                  </>
                ) : (
                  "Update"
                )}
              </button>
              <Link to={`/mix-and-match`}>
                <button className="quic-btn quic-btn-cancle">Cancel</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMixAndMatchDeal;
