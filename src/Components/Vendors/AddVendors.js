import React, { useEffect, useState } from "react";
import axios from "axios";

import { fetchVendorsListData } from "../../Redux/features/VendorList/vListSlice";

import { useSelector, useDispatch } from "react-redux";
import { BASE_URL, ADD_VENDOR_DATA } from "../../Constants/Config";

import BasicTextFields from "../../reuseableComponents/TextInputField";
import { CircularProgress, FormControl, Grid } from "@mui/material";
// import Stack from '@mui/material/Stack';
import CreatableSelect from "react-select/creatable";
import SelectDropDown from "../../reuseableComponents/SelectDropDown";
import { useAuthDetails } from "../../Common/cookiesHelper";
import PasswordShow from "../../Common/passwordShow";
import { Link, useNavigate } from "react-router-dom";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import SwitchToBackButton from "../../reuseableComponents/SwitchToBackButton";
const AddVendors = ({ setVisible }) => {
  const navigate = useNavigate();
  const [allvendors, setallvendors] = useState([]);
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();

  const [states, setStates] = useState([]);
  const {
    LoginGetDashBoardRecordJson,
    LoginAllStore,
    userTypeData,
    GetSessionLogin,
  } = useAuthDetails();
  let merchant_id = LoginGetDashBoardRecordJson?.data?.merchant_id;

  // console.log("states", states);
  const AllVendorsDataState = useSelector((state) => state.vendors);
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState();
  const [loader, setLoader] = useState(false);
  const handleAutocompleteChange = (event) => {
    // setErrorMessage((prevState) => ({
    //   ...prevState,
    //   ["name"]: "",
    // }));

    handleSelectedVendor(event?.value);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    getVendorListData();
  }, []);
  const getVendorListData = async () => {
    try {
      let data = {
        merchant_id: merchant_id,
      };
      await dispatch(fetchVendorsListData(data)).unwrap();
    } catch (error) {
      if (error.status == 401 || error.response.status === 401) {
        getUnAutherisedTokenMessage();
        handleCoockieExpire();
      } else if (error.status == "Network Error") {
        getNetworkError();
      }
    }
  };

  const [vendor, setVendor] = useState({
    name: "",
    email: "",
    phone: "",
    merchant_id: "",
    full_address: "",
    city: "",
    zip_code: "",
    state: "",
  });
  const validate = () => {
    const errors = [];
    let isValid = true;

    const itemErrors = {};
    if (!vendor.name) {
      itemErrors.name = "Please enter a vendor name";
      isValid = false;
    }
    if (vendor.email !== "" && !/\S+@\S+\.\S+/.test(vendor.email)) {
      itemErrors.email = "Invalid email address";
      isValid = false;
    }
    if (!/^\d{10}$/.test(vendor.phone)) {
      itemErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }
    // if (!vendor.full_address) {
    //   itemErrors.full_address = "Please enter a vendor address";
    //   isValid = false;
    // }
    // if (!vendor.city) {
    //   itemErrors.city = "Please enter a vendor city";
    //   isValid = false;
    // }
    // if (!/^\d{5}$/.test(vendor.zip_code)) {
    //   itemErrors.zip_code = "ZIP code must be 5 digits";
    //   isValid = false;
    // }
    // if (!vendor.state) {
    //   itemErrors.state = "Please select state";
    //   isValid = false;
    // }
    setErrorMessage(itemErrors);
    return isValid;
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    let errorMsg = "";
    switch (name) {
      case "name":
        if (value.length <= 0) {
          errorMsg = "Please enter a vendor name";
        }
        break;
      case "email":
        if (value == "") {
          errorMsg = "";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Invalid email address";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          errorMsg = "Phone number must be 10 digits";
        }
        break;
      // case "zip_code":
      //   if (!/^\d{5}$/.test(value)) {
      //     errorMsg = "ZIP code must be 5 digits";
      //   }
      //   break;
      // case "full_address":
      //   if (value.length <= 0) {
      //     errorMsg = "Please enter a vendor address";
      //   }
      //   break;
      // case "city":
      //   if (value.length <= 0) {
      //     errorMsg = "Please enter a vendor city";
      //   }
      //   break;
      // case "state":
      //   if (vendor.state.length <= 0) {
      //     errorMsg = "Please select state";
      //   }
      //   break;
      default:
        break;
    }
    setErrorMessage((prevState) => ({
      ...prevState,
      [name]: errorMsg,
    }));
    setVendor((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };
  // console.log(errorMessage);
  useEffect(() => {
    if (
      !AllVendorsDataState.loading &&
      AllVendorsDataState.vendorListData &&
      AllVendorsDataState.vendorListData.length >= 1
    ) {
      setallvendors(AllVendorsDataState.vendorListData[0]);
      // setStates(AllVendorsDataState.vendorListData[2])

      const stateArray = AllVendorsDataState.vendorListData[2].map(
        (item) => item.State
      );
      setStates(stateArray);
    }
  }, [
    AllVendorsDataState,
    AllVendorsDataState.loading,
    AllVendorsDataState.vendorListData,
  ]);

  const handleSelectedVendor = (selectedOption) => {
    console.log("handleSelectedVendor", selectedOption);
    const matchedObject = allvendors.find(
      (vendor) => vendor.name === selectedOption
    );

    if (matchedObject) {
      let data = {
        phone: matchedObject.phone,
        email: matchedObject.email,
        name: matchedObject.name,
        merchant_id: merchant_id,
        vendor_id: matchedObject.id,
        city: matchedObject.city,
        zip_code: matchedObject.zip_code,
        full_address: matchedObject.full_address,
        state: matchedObject.state,
      };
      setVendor(data);
      setErrorMessage((prevState) => {
        const newErrorMessages = { ...prevState };
        Object.keys(data).forEach((key) => {
          if (data[key]) {
            newErrorMessages[key] = "";
          }
        });
        return newErrorMessages;
      });
    } else {
      // If no match is found, set name to the entered value
      setVendor({
        phone: "",
        email: "",
        name: selectedOption,
        merchant_id: merchant_id,
        full_address: "",
        vendor_id: "",
        city: "",
        zip_code: "",
        // state:''
      });
    }
  };
  // useEffect(() => {
  //   setErrorMessage((prevState) => {
  //     const newErrorMessages = { ...prevState };
  //     Object.keys(vendor).forEach((key) => {
  //       if (vendor[key]) {
  //         newErrorMessages[key] = "";
  //       }
  //     });
  //     return newErrorMessages;
  //   });
  // }, [vendor]);
  const handleSetVendorStateChange = (newState) => {
    console.log("setVendorStateChange", newState);
    setErrorMessage((prevState) => ({
      ...prevState,
      ["state"]: "",
    }));
    setVendor((preState) => ({
      ...preState,
      state: newState["title"],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoader(true);
        const state = value;
        // Assuming `vendor` is an object that you want to send in the request
        let updatedVendor = { ...vendor, ...userTypeData };
        const { token, ...newData } = updatedVendor;
        console.log("setVendorState", updatedVendor);
        const response = await axios.post(BASE_URL + ADD_VENDOR_DATA, newData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response) {
          navigate("/vendors");
          ToastifyAlert("Added Successfully", "success");
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
      } finally {
        setLoader(false);
      }
    }
  };
  const handleKeyPress = (e) => {
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 8) {
      e.preventDefault();
    }
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
  return (
    <>
      <div className="mt-6">
        <Grid container className="box">
          <Grid item xs={12} className="q-add-categories-section">
            <Grid container>
              <SwitchToBackButton
                linkTo={"/vendors"}
                title={"Add New Vendors"}
              />
            </Grid>
            <Grid container sx={{ padding: 2.5 }}>
              <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <div className=" qvrowmain my-1">
                        <label htmlFor="vendorName">Vendor Name</label>
                      </div>
                      <CreatableSelect
                        isClearable
                        styles={customStyles}
                        onChange={handleAutocompleteChange}
                        options={allvendors
                          .filter((option) => option.enabled === "1")
                          .map((option, index) => {
                            return {
                              value: option.name,
                              label: option?.name,
                              name: "name",
                            };
                          })}
                      />
                      {errorMessage.name && (
                        <span className="error">{errorMessage.name}</span>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div className=" qvrowmain my-1">
                        <label htmlFor="email">Email Address</label>
                      </div>
                      <BasicTextFields
                        type={"email"}
                        name="email"
                        value={vendor.email}
                        placeholder="Email Address"
                        onChangeFun={inputChange}
                      />
                      {errorMessage.email && (
                        <span className="error">{errorMessage.email}</span>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div className="qvrowmain my-1">
                        <label htmlFor="phone">Phone Number</label>
                      </div>
                      <BasicTextFields
                        type={"text"}
                        placeholder="Phone Number"
                        // required={"required"}
                        name={"phone"}
                        onChangeFun={inputChange}
                        value={vendor.phone}
                        maxLength={10}
                        onKeyPressFun={handleKeyPress}
                      />
                      {errorMessage.phone && (
                        <span className="error">{errorMessage.phone}</span>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ marginTop: 0 }} spacing={2}>
                    <Grid item xs={12}>
                      <div className=" qvrowmain my-1">
                        <label htmlFor="address">Address</label>
                      </div>
                      <BasicTextFields
                        type={"text"}
                        name={"full_address"}
                        placeholder="Address Line 1"
                        onChangeFun={inputChange}
                        value={vendor.full_address}
                      />
                      {errorMessage.full_address && (
                        <span className="error">
                          {errorMessage.full_address}
                        </span>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ marginTop: 0 }} spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <div className="qvrowmain my-1">
                        <label htmlFor="city">City</label>
                      </div>
                      <BasicTextFields
                        type={"text"}
                        name={"city"}
                        value={vendor.city}
                        placeholder="City"
                        onChangeFun={inputChange}
                      />
                      {errorMessage.city && (
                        <span className="error">{errorMessage.city}</span>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div className="my-1 qvrowmain">
                        <label htmlFor="State">State</label>
                      </div>
                      <SelectDropDown
                        listItem={states.map((item) => ({
                          title: item,
                          name: "state",
                          value: vendor.state,
                        }))}
                        title={"title"}
                        selectedOption={vendor.state}
                        onClickHandler={handleSetVendorStateChange}
                        name={"state"}
                      />
                      {errorMessage.state && (
                        <span className="error">{errorMessage.state}</span>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <div className="my-1 qvrowmain">
                        <label htmlFor="zip">Zip</label>
                      </div>
                      <BasicTextFields
                        type={"text"}
                        name="zip_code"
                        value={vendor.zip_code}
                        placeholder="Zip"
                        onChangeFun={inputChange}
                        maxLength={5}
                      />
                      {errorMessage.zip_code && (
                        <span className="error"> {errorMessage.zip_code}</span>
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    xs={12}
                    sx={{ marginTop: 3 }}
                  >
                    <button
                      type="submit"
                      className="quic-btn quic-btn-save me-3 w-40"
                      disabled={loader}
                    >
                      {loader ? (
                        <CircularProgress
                          color={"inherit"}
                          className=""
                          width={15}
                          size={15}
                        />
                      ) : (
                        "Add"
                      )}
                    </button>
                    <Link to={`/vendors`}>
                      <button
                        // onClick={() => setVisible("VendorsDetail")}
                        className="quic-btn quic-btn-cancle"
                      >
                        Cancel
                      </button>
                    </Link>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default AddVendors;
