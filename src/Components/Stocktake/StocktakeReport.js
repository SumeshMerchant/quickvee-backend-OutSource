import { CircularProgress, Grid } from "@mui/material";
import AddSvg from "../../Assests/Dashboard/Left.svg";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthDetails } from "../../Common/cookiesHelper";
import { BASE_URL, VOID_STOCKTAKE } from "../../Constants/Config";
import { ToastifyAlert } from "../../CommonComponents/ToastifyAlert";
import EmailModel from "./EmailModel";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleStocktakeData } from "../../Redux/features/Stocktake/StocktakeListSlice";
import { priceFormate } from "../../hooks/priceFormate";

const StyledTable = styled(Table)(({ theme }) => ({
  padding: 2,
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
  "&:last-child td, &:last-child th": {},
  "& td, & th": {
    border: "none",
  },
}));

const StocktakeReport = ({ setVisible }) => {
  const [singleStocktakeState, setSingleStocktakeState] = useState();
  const [loader, setLoader] = useState(false);
  const { LoginGetDashBoardRecordJson, userTypeData } = useAuthDetails();
  const { data: { merchant_id } = {} } = LoginGetDashBoardRecordJson;

  const singleStocktakeStateFromRedux = useSelector(
    (state) => state.stocktakeList
  );
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleStocktakeData({ merchant_id, id, userTypeData }));
    }
  }, [id]);

  useEffect(() => {
    if (
      !singleStocktakeStateFromRedux.loading &&
      singleStocktakeStateFromRedux.singleStocktakeState
    ) {
      setSingleStocktakeState(
        singleStocktakeStateFromRedux.singleStocktakeState
      );
    }
  }, [
    singleStocktakeStateFromRedux.loading,
    singleStocktakeStateFromRedux.singleStocktakeState,
  ]);

  const navigate = useNavigate();

  const tableRow = [
    "Item Name",
    "Current Qty",
    "New Qty",
    "Discrepancy",
    "Discrepancy Cost",
    "UPC",
  ];

  const handleVoidClick = async () => {
    const data = {
      merchant_id,
      stocktake_id: singleStocktakeState.id,
    };
    try {
      setLoader(true);
      const { token, ...otherUserData } = userTypeData;
      const response = await axios.post(
        `${BASE_URL}${VOID_STOCKTAKE}`,
        { ...data, ...otherUserData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        ToastifyAlert(response.data.message, "success");
        setTimeout(()=>{setLoader(false);},300)
        
      } else {
        ToastifyAlert(response.data.message, "error");
        setTimeout(()=>{setLoader(false);},300)
      }
    } catch (error) {
      console.error("Error voiding stocktake:", error);
      ToastifyAlert("Error voiding stocktake. Please try again.", "error");
      setTimeout(()=>{setLoader(false);},300)
    }
    // setVisible("StocktakeList");
    navigate(-1);
  };

  const handlePrint = () => {
    navigate("/stocktake/print-stocktake-report", {
      state: { data: singleStocktakeState },
    });
  };
  const formatCurrency = (amount) => {
    const formattedAmount = Math.abs(
      amount
    ).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return amount < 0
      ? `-${formattedAmount}`
      : formattedAmount;
  };
  return (
    <Grid container className="box_shadow_div">
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <div className="q-add-categories-section-header">
              <span
                onClick={() => {
                  
                  navigate(-1);
                }}
                className="text-center items-center"
              >
                <img src={AddSvg} alt="Add-New-Category"  />

                <span>Stocktake Report - {singleStocktakeState?.st_id}</span>
              </span>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ py: 2.5 }}>
          <Grid item xs={12}>
            <TableContainer>
              <StyledTable aria-label="customized table">
                <TableHead>
                  {tableRow.map((title) => (
                    <StyledTableCell>{title}</StyledTableCell>
                  ))}
                </TableHead>

                <TableBody>
                  {singleStocktakeState?.stocktake_item.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{item.product_name}</StyledTableCell>

                      <StyledTableCell>{item.current_qty}</StyledTableCell>

                      <StyledTableCell>{item.new_qty}</StyledTableCell>

                      <StyledTableCell>{item.discrepancy}</StyledTableCell>

                      <StyledTableCell>
                        
                        {formatCurrency(
                          parseFloat(item.discrepancy_cost).toFixed(2)
                        )}
                      </StyledTableCell>

                      <StyledTableCell>{item.upc}</StyledTableCell>
                    </StyledTableRow>
                  ))}

                  <StyledTableRow>
                    <StyledTableCell>
                      <p className="text-[#0A64F9]">Total Discrepancy</p>
                    </StyledTableCell>

                    <StyledTableCell></StyledTableCell>

                    <StyledTableCell></StyledTableCell>

                    <StyledTableCell>
                      <p className="text-[#0A64F9]">
                        {singleStocktakeState?.total_discrepancy}
                      </p>
                    </StyledTableCell>

                    <StyledTableCell>
                      <p className="text-[#0A64F9]">
                        {formatCurrency(singleStocktakeState?.total_discrepancy_cost)}
                      </p>
                    </StyledTableCell>

                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
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
                  onClick={() => {
                    
                    navigate(-1);
                  }}
                  className="quic-btn quic-btn-cancle w-32"
                >
                  Cancel
                </button>
              </Grid>

              {singleStocktakeState?.status === "0" && (
                <Grid item>
                  <button
                    className="quic-btn quic-btn-save attributeUpdateBTN w-32"
                    onClick={handleVoidClick}
                      disabled={loader}
                  >
                    {loader ? (
                      <>
                        <CircularProgress
                          color={"inherit"}
                          className="loaderIcon"
                          width={15}
                          size={15}
                        />
                        Void
                      </>
                    ) : (
                      "Void"
                    )}
                  </button>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item>
            {singleStocktakeState?.status === "0" && (
              <Grid container spacing={3}>
                <Grid item>
                  <EmailModel singleStocktakeState={singleStocktakeState} />
                </Grid>

                <Grid item>
                  <button
                    className="quic-btn quic-btn-save w-32"
                    onClick={handlePrint}

                    
                  >
                    Print
                   
                  </button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <div style={{ display: "none" }}></div>
    </Grid>
  );
};

export default StocktakeReport;
