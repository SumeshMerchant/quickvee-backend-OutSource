import React, { useEffect } from "react";

import InfoFunction from "./infoFunctionality/infoFunction";

import { CircularProgress, Grid } from "@mui/material";
import StoreHeading from "./StoreHeading";
import MenuLink from "./MenuLink";
import LogoAndBanner from "./LogoAndBanner";
import AddressForm from "./AddressForm";
import SocialMediaForm from "./SocialMediaForm";

const Info = () => {
  const {
    handleSubmitInfo,
    imageBanner,
    image,
    handleDelete,
    handleEditRecord,
    infoRecord,
    onChangeHandle,
    imageBoolean,
    BannersBoolean,
    successsMessage,
    hideSucess,
    errors,
    handleKeyPress,
    onPasswordInputChange,
    passwordInput,
    passwordError,
    handleSubmitChangePassword,
    qrCodeBoolean,
    receieptLogoBool,
    user_id,
    merchant_idNew,
    handleBlurPassword,
    submitLoading,
    stateList,
    onDropDownChangeHandle,
    login_type,
    qrValue,
    logoValue,
    receiptValue,
  } = InfoFunction();
  let data = {
    id: user_id,
    merchant_id: merchant_idNew, //dynamic id give
  };
  useEffect(() => {
    handleEditRecord(data);
  }, []);
  // console.log("infoRecord", infoRecord);
  return (
    <>
      <Grid container sx={{ mb: 10 }}>
        <Grid item xs={12}>
          <StoreHeading
            hideSucess={hideSucess}
            successsMessage={successsMessage}
            infoRecord={infoRecord}
          />

          <MenuLink infoRecord={infoRecord} onChangeHandle={onChangeHandle} />

          <LogoAndBanner
            BannersBoolean={BannersBoolean}
            infoRecord={infoRecord}
            handleDelete={handleDelete}
            onChangeHandle={onChangeHandle}
            imageBoolean={imageBoolean}
            errors={errors}
            qrCodeBoolean={qrCodeBoolean}
            receieptLogoBool={receieptLogoBool}
            login_type={login_type}
            qrValue={qrValue}
            logoValue={logoValue}
            receiptValue={receiptValue}
          />
          <form>
            <AddressForm
              handleKeyPress={handleKeyPress}
              errors={errors}
              infoRecord={infoRecord}
              onChangeHandle={onChangeHandle}
              stateList={stateList}
              onDropDownChangeHandle={onDropDownChangeHandle}
            />

            <SocialMediaForm
              infoRecord={infoRecord}
              onChangeHandle={onChangeHandle}
              handleSubmitInfo={handleSubmitInfo}
              errors={errors}
            />
          </form>

          {/* <ChangePasswordForm
        onPasswordInputChange={onPasswordInputChange}
        handleSubmitChangePassword={handleSubmitChangePassword}
        passwordInput={passwordInput}
        passwordError={passwordError}
        handleBlurPassword={handleBlurPassword}
      /> */}
        </Grid>
      </Grid>

      <Grid className="fixed-bottom">
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mb: 0, p: 2.5 }}
          className="box_shadow_div p-3"
        >
          <Grid item className="">
            <button
              class="quic-btn quic-btn-save attributeUpdateBTN w-36"
              onClick={handleSubmitInfo}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <CircularProgress
                    color={"inherit"}
                    className="loaderIcon"
                    width={15}
                    size={15}
                  />
                  Update
                </>
              ) : (
                "Update"
              )}
            </button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Info;
