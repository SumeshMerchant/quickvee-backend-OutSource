import React, { useEffect, useState } from "react";
import axios from "axios";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import { fetchAttributesData } from "../../Redux/features/Attributes/attributesSlice";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL, ADD_ATTRIBUTE } from "../../Constants/Config";
import AddIcon from "../../Assests/Category/addIcon.svg";

import BasicTextFields from "../../reuseableComponents/TextInputField";
import DraggableTable from "../../reuseableComponents/DraggableTable";
import { Box, Modal } from "@mui/material";

import { useAuthDetails } from "../../Common/cookiesHelper";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import PasswordShow from "../../Common/passwordShow";
import CircularProgress from "@mui/material/CircularProgress";

const AtrDataList = ({ seVisible }) => {
  const [showModal, setShowModal] = useState(false);
  const { LoginGetDashBoardRecordJson, LoginAllStore, userTypeData } =
    useAuthDetails();
  const [loader, setLoader] = useState(false);
  let AuthDecryptDataDashBoardJSONFormat = LoginGetDashBoardRecordJson;
  const merchant_id = AuthDecryptDataDashBoardJSONFormat?.data?.merchant_id;
  const dispatch = useDispatch();
  useEffect(() => {
    // let data = {
    //   merchant_id: merchant_id,
    //   ...userTypeData,
    // };
    // if (data) {
    //   dispatch(fetchAttributesData(data));
    // }
    getfetchAttributesData();
  }, []);
  const { handleCoockieExpire, getUnAutherisedTokenMessage, getNetworkError } =
    PasswordShow();
  const getfetchAttributesData = async () => {
    try {
      let data = {
        merchant_id: merchant_id,
        ...userTypeData,
      };
      if (data) {
        await dispatch(fetchAttributesData(data)).unwrap();
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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setNewAttribute("");
    setShowModal(false);
    setErrorMessage();
  };

  //sachin code start
  //add
  const [errorMessage, setErrorMessage] = useState("");
  // const [showModal, setShowModal] = useState(false);
  const [newAttribute, setNewAttribute] = useState("");
  const [submitmessage, setsubmitmessage] = useState("");
  const [nameExists, setNameExists] = useState("");

  const [allattributes, setallattributes] = useState([]);
  const AllAttributesDataState = useSelector((state) => state.attributes);

  useEffect(() => {
    if (
      !AllAttributesDataState.loading &&
      AllAttributesDataState.attributesData
    ) {
      setallattributes(AllAttributesDataState.attributesData);
    }
  }, [
    AllAttributesDataState,
    AllAttributesDataState.loading,
    AllAttributesDataState.attributesData,
  ]);

  const changeTittleHandler = (event) => {
    let value = event.target.value;
    const regex = /^[A-Za-z0-9 ]*$/;
    const space = /^(?!\s).*/;
    if (space.test(value)) {
      if (regex.test(value) || value === "") {
        setNewAttribute(value);
        const nameExists = allattributes.some((item) => item.title.toLowerCase() === value.toLowerCase());
        if (nameExists) {
          setErrorMessage("Attribute name already exists");
          setNameExists(true);
        } else {
          setErrorMessage("");
          setNameExists(false);
        }
      } else {
        setErrorMessage("Special characters are not allowed");
      }
    }
  };

  const handleAddAttribute = async () => {
    if (nameExists) {
      return false;
    }
    if (!newAttribute.trim()) {
      // Check if newAttribute is empty or only contains whitespace
      setErrorMessage("Title is required");
      return;
    }
    setLoader(true);
    try {
      const newItem = {
        merchant_id: merchant_id,
        title: newAttribute,
        token_id: userTypeData?.token_id,
        login_type: userTypeData?.login_type,
      };
      const data = newItem;
      const response = await axios.post(BASE_URL + ADD_ATTRIBUTE, newItem, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userTypeData?.token}`,
        },
      });
      if (response) {
        setShowModal(false);
        ToastifyAlert("Added Successfully", "success");
        setNewAttribute("");
        let merchantdata = {
          merchant_id: merchant_id,
          ...userTypeData,
        };
        if (merchantdata) {
          dispatch(fetchAttributesData(merchantdata));
        }
      } else {
        setsubmitmessage(response.data.message);
        setNewAttribute("");
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
  };

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setNewAttribute("")
    setErrorMessage("");
    setShowModal(false);
  }

  const myStyles = {
    width: "60%",
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "'CircularSTDMedium', sans-serif !important",
  };

  return (
    <>
      <div className="box">
        <div className="q-attributes-bottom-detail-section">
          <div className="q-attributes-bottom-header-sticky">
            <div className="q-attributes-bottom-header">
              <span>Attributes</span>

              <p className="" onClick={openModal}>
                Add Attribute <img src={AddIcon} alt="add-icon" />
              </p>
            </div>
          </div>

          <DraggableTable
            tableHead={["Sort", "Title", ""]}
            tableRow={allattributes}
            setFunction={setallattributes}
            editAttributeObj={true}
            table={"varients"}
            loading={AllAttributesDataState.loading}
          />

          <Modal
            open={showModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="view-category-item-modal" style={myStyles}>
              <div
                className="q-add-categories-section-header text-[18px]"
                style={{
                  justifyContent: "space-between",
                  fontFamily: "CircularSTDBook",
                }}
              >
                <span style={{ cursor: "unset" }}>Add New Attribute</span>

                <div>
                  <img
                    src={CrossIcon}
                    alt="icon"
                    className="  quic-btn-cancle w-6 h-6 cursor-pointer"
                    onClick={() => handleClose()}
                  />
                </div>
              </div>

              <div className="view-category-item-modal-header">
                <div
                  className="title_attributes_section "
                  style={{ margin: "1rem 1rem" }}
                >
                  <label className="mb-2">Title</label>
                  <BasicTextFields
                    value={newAttribute}
                    onChangeFun={changeTittleHandler}
                    placeholder="Enter attribute title"
                    maxLength={35}
                  />
                  <span className="input-error">
                    {errorMessage !== "" ? errorMessage : ""}
                  </span>
                </div>
              </div>

              <div className="q-add-categories-section-middle-footer">
                <button
                  onClick={handleAddAttribute}
                  className="quic-btn quic-btn-save attributeUpdateBTN"
                  disabled={loader}
                >
                  {loader ? (
                    <>
                      <CircularProgress
                        color={"inherit"}
                        className="loaderIcon"
                        width={15}
                        size={15}
                      />{" "}
                      Add
                    </>
                  ) : (
                    "Add"
                  )}
                  {/* Add */}
                </button>
                <button
                  onClick={closeModal}
                  className="quic-btn quic-btn-cancle"
                >
                  Cancel
                </button>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AtrDataList;
