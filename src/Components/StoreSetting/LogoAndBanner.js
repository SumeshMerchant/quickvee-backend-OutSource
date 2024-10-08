import { Grid } from "@mui/material";
import { BASE_URL } from "../../Constants/Config";
import infoImage from "../../image/Group 196.svg";
import deleteIcon from "../../Assests/Category/deleteIcon.svg";
const LogoAndBanner = ({
  BannersBoolean,
  infoRecord,
  handleDelete,
  onChangeHandle,
  imageBoolean,
  qrCodeBoolean,
  errors,
  receieptLogoBool,
  login_type,
  qrValue,
  logoValue,
  receiptValue,
}) => {
  return (
    <Grid container sx={{ p: 2.5 }} className="box_shadow_div">
      <Grid item xs={12}>
        <Grid container>
          <Grid item sx={{ mr: 2.5 }}>
            <Grid container sx={{ mb: 1 }}>
              <h1 className="info-menu">Logo</h1>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <div className="info-banner-image-div">
                  {errors.imageErrors == "" && infoRecord.image ? (
                    <div className="info-delete cursor-pointer">
                      <div
                        className="verifiedTableIcon"
                        onClick={() => handleDelete("image")}
                      >
                        {" "}
                        <img src={deleteIcon} />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="info-file-upload">
                    {infoRecord.image == "" ? (
                      <>
                        <label htmlFor="file-input1" className="file-input1">
                          <img
                            src={infoImage}
                            alt="Upload Image"
                            className="info-image-icon"
                          />
                          <div className="info-image-logo-position">
                            <p className="inforecord-email">Add Logo</p>
                          </div>
                        </label>
                        <input
                          id="file-input1"
                          name="image"
                          style={{ visibility: "hidden" }}
                          type="file"
                          onChange={onChangeHandle}
                        />
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="file-input-1"
                          className="file-input1 info-background"
                          style={{
                            backgroundImage: `url(${
                              logoValue !== "1"
                                ? !imageBoolean
                                  ? BASE_URL + "upload/" + infoRecord.image
                                  : infoRecord.image
                                : ""
                            })`,
                          }}
                        ></label>
                        <input
                          id="file-input-1"
                          name="image"
                          style={{ display: "none" }}
                          type="file"
                          onChange={onChangeHandle}
                        />
                      </>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
            {errors.imageErrors && (
              <span className="error">{errors.imageErrors}</span>
            )}
          </Grid>
          {login_type?.toLowerCase() == "superadmin" ? (
            <>
              <Grid item sx={{ mx: 2.5 }}>
                <Grid container sx={{ mb: 1 }}>
                  <Grid item xs={12}>
                    <h1 className="info-menu">QR Code</h1>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <div className="info-qrCodeDiv-image-div">
                      {errors.qrCodeError == "" && infoRecord.qrCode ? (
                        <div className="info-delete-qr cursor-pointer">
                          <div
                            className="verifiedTableIcon"
                            onClick={() => handleDelete("qrCode")}
                          >
                            {" "}
                            <img src={deleteIcon} />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="info-file-upload">
                        {infoRecord.qrCode === "" ? (
                          <>
                            <label
                              htmlFor="file-input2"
                              className="file-input1"
                            >
                              <img
                                src={infoImage}
                                alt="Upload Image"
                                className="info-image-icon"
                              />
                              <div className="info-image-logo-position">
                                <p className="inforecord-email whitespace-nowrap">
                                  Add QR code
                                </p>
                              </div>
                            </label>
                            <input
                              id="file-input2"
                              name="qrCode"
                              style={{ display: "none" }}
                              type="file"
                              onChange={onChangeHandle}
                            />
                          </>
                        ) : (
                          <>
                            <label
                              htmlFor="file-input5"
                              className="file-input1 info-background"
                              style={{
                                backgroundImage: `url(${
                                  qrValue !== "1"
                                    ? !qrCodeBoolean
                                      ? BASE_URL +
                                        "upload/qr_code/" +
                                        infoRecord.qrCode
                                      : infoRecord.qrCode
                                    : ""
                                })`,
                              }}
                            ></label>
                            <input
                              id="file-input5"
                              name="qrCode"
                              style={{ display: "none" }}
                              type="file"
                              onChange={onChangeHandle}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {errors.qrCodeError && (
                      <div className="error">{errors.qrCodeError}</div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              {/* </>
          ) : (
            ""
          )} */}
              <Grid item sx={{ mx: 2.5 }}>
                <Grid container sx={{ mb: 1 }}>
                  <Grid item xs={12}>
                    <h1 className="info-menu">Receipt Logo</h1>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <div className="info-qrCodeDiv-image-div">
                      {errors.qrReciptError == "" && infoRecord.receieptLogo ? (
                        <div className="info-delete-qr cursor-pointer">
                          <div
                            className="verifiedTableIcon"
                            onClick={() => handleDelete("receieptLogo")}
                          >
                            {" "}
                            <img src={deleteIcon} />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="info-file-upload">
                        {infoRecord.receieptLogo === "" ? (
                          <>
                            <label
                              htmlFor="file-input4"
                              className="file-input1"
                            >
                              <img
                                src={infoImage}
                                alt="Upload Image"
                                className="info-image-icon"
                              />
                              <div className="info-image-logo-position">
                                <p className="inforecord-email whitespace-nowrap">
                                  Add Receipt Logo
                                </p>
                              </div>
                            </label>
                            <input
                              id="file-input4"
                              name="receieptLogo"
                              style={{ display: "none" }}
                              type="file"
                              onChange={onChangeHandle}
                            />
                          </>
                        ) : (
                          <>
                            <label
                              htmlFor="file-input4"
                              className="file-input1 info-background"
                              style={{
                                backgroundImage: `url(${
                                  receiptValue !== "1"
                                    ? !receieptLogoBool
                                      ? BASE_URL +
                                        "upload/" +
                                        infoRecord.receieptLogo
                                      : infoRecord.receieptLogo
                                    : ""
                                })`,
                              }}
                            ></label>
                            <input
                              id="file-input4"
                              name="receieptLogo"
                              style={{ display: "none" }}
                              type="file"
                              onChange={onChangeHandle}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {errors.qrReciptError && (
                      <div className="error">{errors.qrReciptError}</div>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
        <Grid container sx={{ mb: 1, mt: 2.5 }}>
          <Grid item xs={12}>
            <h1 className="info-menu">Banner</h1>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <div
              className={"info-banner"}
              style={{
                backgroundImage: !BannersBoolean
                  ? `url('${BASE_URL}upload/banner/${
                      infoRecord.banners ? infoRecord.banners : ""
                    }')`
                  : `url('${infoRecord.banners}')`,
                backgroundSize: "cover",
              }}
            >
              {infoRecord.banners ? (
                <div className="info-delete-banner cursor-pointer">
                  <div
                    className="verifiedTableIcon"
                    onClick={() => handleDelete("banners")}
                  >
                    {" "}
                    <img src={deleteIcon} />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="info-upload-image-button ">
                <label
                  htmlFor="fileInput3"
                  className="inforecord-email cursor-pointer"
                >
                  Add Banner
                </label>
                <input
                  type="file"
                  id="fileInput3"
                  style={{ display: "none" }}
                  name="banners"
                  onChange={onChangeHandle}
                />
              </div>
            </div>

            {errors.bannerErrors && <br />}
            {errors.bannerErrors && (
              <span className="error">{errors.bannerErrors}</span>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LogoAndBanner;
