import React, { useEffect, useState, useRef } from "react";
import {
  INVENTORY_LIST,
  BASE_URL,
  LIST_ALL_CATEGORIES,
} from "../../../Constants/Config";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";

import { useAuthDetails } from "../../../Common/cookiesHelper";
import axios from "axios";
import PasswordShow from "../../../Common/passwordShow";

export default function ProfitMarginReportLogic() {
  const dispatch = useDispatch();
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const [inventory, setInventory] = useState("");
  const [category, setCategory] = useState([]);
  const [searchProduct, setsearchProduct] = useState([]); // invenotry list display
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectCategoryId, setSelectCategoryId] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [listingType, setListingType] = useState(1);
  const [message, setMessage] = useState(""); // message display
  const [endOfDataList, setEndOfDataList] = useState(false);
  const [laodMoreData, setLoadMoreData] = useState(false); //load button hide and show

  const [loader, setLoader] = useState(false);
  const { token, ...newData } = userTypeData;

  // =======================
  const handleSearchProduct = useRef(
    debounce(async (value, id) => {
      try {
        const { token, ...newData } = userTypeData;

        let packet = {
          ...newData,
          cat_id: id,
          name: value,
          merchant_id,
          offset: 0,
          limit,
          format: "json",
          listing_type: listingType,
        };
        // console.log("packet", packet);

        setLoader(true);
        let response = await axios.post(BASE_URL + INVENTORY_LIST, packet, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userTypeData?.token}`,
          },
        });
        if (response?.data.length > 0) {
          setEndOfDataList(true);
        } else {
          setEndOfDataList(false);
        }
        setLoadMoreData(false);
        if (response?.data.length > 0) {
          setLoader(false);
          setsearchProduct(response?.data);
        } else {
          setLoader(false);
          setsearchProduct([]);
          setMessage("No record found");
        }
      } catch (error) {
        if (error.status == 401 || error.response.status === 401) {
          getUnAutherisedTokenMessage();
          handleCoockieExpire();
        } else if (error.status == "Network Error") {
          getNetworkError();
        }
      }
    }, 500)
  );

  // =======================

  const handleChangeInventory = (e) => {
    setInventory(e.target.value);
    handleSearchProduct.current(e.target.value, selectCategoryId);
  };
  useEffect(() => {
    getAllCategoryList();
    handleOptionClick();
  }, []);

  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  const getAllCategoryList = async () => {
    try {
      const packet = { merchant_id, ...newData };
      let response = await axios.post(BASE_URL + LIST_ALL_CATEGORIES, packet, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData?.token}`,
        },
      });
      if (response) {
        setCategory(response?.data?.result);
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
  // category click button function-----------------------
  const handleOptionClick = async (data) => {
    setInventory("");
    try {
      setLoader(true);
      setSelectedCategory(
        data == "All" || data == undefined ? "All" : data?.title
      );
      let id = data == "All" || data == undefined ? "all" : data?.id;
      const packet = {
        cat_id: id,
        offset,
        limit,
        format: "json",
        merchant_id,
        listing_type: listingType,
        ...userTypeData,
      };
      setSelectCategoryId(id);
      const { token, ...newData } = packet;
      let response = await axios.post(BASE_URL + INVENTORY_LIST, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.length) {
        setLoader(false);
        setsearchProduct(response?.data);
        if (id == "all") {
          setEndOfDataList(false);
          setOffset(10);
        } else {
          setEndOfDataList(true);
          setOffset(0);
          setLoadMoreData(false);
        }
      } else {
        setLoader(false);
        setMessage("No record found");
        setsearchProduct([]);
      }
    } catch (error) {
      if (error?.status == 401 || error.response?.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error?.status == "Network Error") {
        getNetworkError();
      }
    }
  };
  //   category click button function---------------------
  // button click when loadmore display
  const handleLoadMore = async () => {
    try {
      setLoadMoreData(true);
      const packet = {
        cat_id: selectCategoryId,
        offset,
        limit,
        merchant_id,
        format: "json",

        listing_type: listingType,
        ...userTypeData,
      };
      const { token, ...newData } = packet;

      let response = await axios.post(BASE_URL + INVENTORY_LIST, newData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.length) {
        setLoader(false);
        console.log(response?.data);
        setsearchProduct([...searchProduct, ...response?.data]);
        if (selectCategoryId == "all" && response?.data.length !== 10) {
          // setEndOfDataList(true);
          setOffset(offset + 10);
        } else {
          setOffset(0);
        }
      } else {
        setLoader(false);
        setEndOfDataList(true);
        setMessage("No record found");
        // setsearchProduct([]);
      }
    } catch (error) {
      if (error?.status == 401 || error.response?.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
    setLoadMoreData(false);
  };
  // button click when loadmore display
  return {
    handleChangeInventory,
    inventory,

    category,
    handleOptionClick,
    selectedCategory,
    message,
    searchProduct,
    handleLoadMore,
    laodMoreData,
    loader,
    setsearchProduct,
    endOfDataList,
  };
}
