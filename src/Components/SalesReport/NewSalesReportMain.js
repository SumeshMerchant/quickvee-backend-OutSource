import React, { useState, useEffect, lazy, Suspense } from "react";
import Grid from "@mui/system/Unstable_Grid/Grid";

import SelectDropDown from "../../reuseableComponents/SelectDropDown";
import downloadIcon from "../../Assests/Dashboard/download.svg";
import DashDateRangeComponent from "../../reuseableComponents/DashDateRangeComponent";
import VerticalBarChart from "../Dashboard/VerticalBarChart";
import { useNavigate, useParams } from "react-router-dom";
import { CSVLink } from "react-csv";
const SalesReportMain = lazy(
  () => import("../Reporting/SalesReport/SalesReportMain")
);
const LocationMain = lazy(() => import("./Location/LocationMain"));
const CategoryMain = lazy(() => import("./Category/CategoryMain"));
const VendorsMain = lazy(() => import("./Vendors/VendorsMain"));
const EmployeeSalesMain = lazy(
  () => import("./EmployeeSales/EmployeeSalesMain")
);
const CustomerReportMain = lazy(() => import("./Customer/CustomerReportMain"));
const DiscountReportMain = lazy(() => import("./Discount/DiscountReportMain"));
const SalesByHourMain = lazy(
  () => import("../Reporting/SalesReport/SalebyHour/SalebyHourMain")
);
const ItemsMain = lazy(() => import("../Reporting/ItemSales/MainItemSales"));
const DailyTotalsMain = lazy(
  () => import("../Reporting/DailyReport/DailyTtlReport")
);
const OrderTypeMain = lazy(() => import("../Reporting/ItemType/MainItem"));
const DetailedcategoryMain = lazy(
  () => import("../Reporting/CategoryDetails/MainCatedetails")
);
const DetailedsalespersonMain = lazy(
  () => import("../Reporting/SalesByPerson/MainSalesPerson")
);
const TopsellerMain = lazy(
  () => import("../Reporting/TopSaller/TopSallerReport")
);
const OrderefundreportMain = lazy(
  () => import("../Reporting/OrderRefundReport/OrderRefundReportMain")
);
const ItemrefundreportMain = lazy(
  () => import("../Reporting/RefundSummary/RefundSummary")
);
const TipreportMain = lazy(
  () => import("../Reporting/TipReport/TipReportMain")
);
const CouponreportMain = lazy(
  () => import("../Reporting/CouponReport/CouponReportMain")
);
const EmployeesalespercategoryreportMain = lazy(
  () =>
    import("../Reporting/EmployeeSalesPerCategory/MainEmployeeSalesPerCategory")
);
const selectReportList = [
  {
    title: "Sales Summary",
    url: "sales-summary",
  },
  {
    title: "Location",
    url: "location",
  },
  {
    title: "Category",
    url: "category",
  },
  {
    title: "Vendors",
    url: "vendors",
  },
  {
    title: "Employee Sales",
    url: "employee-sales",
  },
  {
    title: "Customer",
    url: "customer",
  },
  {
    title: "Discount",
    url: "discount",
  },
  {
    title: "Sales by Hour",
    url: "sales-by-hour",
  },
  {
    title: "Items",
    url: "items",
  },
  {
    title: "Daily Totals",
    url: "daily-totals",
  },
  {
    title: "Order Type",
    url: "order-type",
  },
  {
    title: "Detailed Category Report",
    url: "detailed-category-report",
  },
  {
    title: "Detailed Sales Person Report",
    url: "detailed-sales-person-report",
  },
  {
    title: "Top Seller",
    url: "top-seller",
  },
  {
    title: "Order Refund Report",
    url: "order-refund-report",
  },
  {
    title: "Item Refund Report",
    url: "item-refund-report",
  },
  {
    title: "Tip Report",
    url: "tip-report",
  },
  {
    title: "Coupon Report",
    url: "coupon-report",
  },
  {
    title: "Employee Sales Per Category Report",
    url: "employee-sales-per-category-report",
  },
];
const NewSalesReportMain = () => {
  const navigate = useNavigate();
  const { selectedReport } = useParams();
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [CSVData, setCSVData] = useState([]);
  const [CSVHeaders, setCSVHeader] = useState([]);
  const onDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };
  const [selectedReportList, setSelectedReportList] = useState("Sales Summary");
  useEffect(() => {
    // If the selectedReport is undefined, push the "sales-summary" to the URL
    if (!selectedReport) {
      navigate("/store-reporting/new-sale-report/sales-summary", {
        replace: true,
      });
    }
    console.log("selectedReport: ", selectedReport);
    setSelectedReportList(
      selectReportList.find((item) => item.url === selectedReport).title
    );
    setCSVData([]);
    setCSVHeader([]);
  }, [navigate]);

  const handleOptionClick = (option, dropdown) => {
    switch (dropdown) {
      case "reportList":
        setSelectedReportList(option.title);
        navigate(`/store-reporting/new-sale-report/${option.url}`);
        break;

      default:
        break;
    }
  };

  const renderComponent = () => {
    switch (selectedReport) {
      case "sales-summary":
        return <SalesReportMain hide={true} />;
      case "location":
        return <LocationMain hide={true} />;
      case "category":
        return <CategoryMain hide={true} />;
      case "vendors":
        return <VendorsMain hide={true} />;
      case "employee-sales":
        return <EmployeeSalesMain hide={true} />;
      case "customer":
        return <CustomerReportMain hide={true} />;
      case "discount":
        return <DiscountReportMain hide={true} />;
      case "sales-by-hour":
        return <SalesByHourMain hide={true} />;
      case "items":
        return (
          <ItemsMain
            setCSVData={setCSVData}
            setCSVHeader={setCSVHeader}
            hide={true}
          />
        );
      case "daily-totals":
        return <DailyTotalsMain hide={true} />;
      case "order-type":
        return <OrderTypeMain hide={true} />;

      case "detailed-category-report":
        return <DetailedcategoryMain hide={true} />;
      case "detailed-sales-person-report":
        return <DetailedsalespersonMain hide={true} />;
      case "top-seller":
        return <TopsellerMain hide={true} />;
      case "order-refund-report":
        return (
          <OrderefundreportMain
            setCSVData={setCSVData}
            setCSVHeader={setCSVHeader}
            hide={true}
          />
        );

      case "item-refund-report":
        return (
          <ItemrefundreportMain
            setCSVData={setCSVData}
            setCSVHeader={setCSVHeader}
            hide={true}
          />
        );

      case "tip-report":
        return <TipreportMain hide={true} />;
      case "coupon-report":
        return <CouponreportMain hide={true} />;
      case "employee-sales-per-category-report":
        return <EmployeesalespercategoryreportMain hide={true} />;

      default:
        break;
    }
  };

  return (
    <>
      <Grid container sx={{ padding: 2.5, mt: 3.6 }} className="box_shadow_div">
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item sx={{ display: "flex", gap: 2 }}>
              <h1
                style={{ marginBottom: 0 }}
                className="heading content-center whitespace-nowrap"
              >
                Sales Report
              </h1>
              <SelectDropDown
                sx={{ pt: 0.5, width: "22.7rem" }}
                listItem={selectReportList}
                onClickHandler={handleOptionClick}
                selectedOption={selectedReportList}
                dropdownFor={"reportList"}
                title={"title"}
              />
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
            >
              <CSVLink data={CSVData} headers={CSVHeaders}>
                <div className="flex justify-center items-center flex-nowrap">
                  <h1 className="text-[#0A64F9] text-[16px]">Export report</h1>
                  <img
                    style={{ height: "30px", width: "30px" }}
                    src={downloadIcon}
                    alt="downloadIcon"
                  />
                </div>
              </CSVLink>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid container sx={{ paddingY: 3.7 }}>
        <Grid item xs={12}>
          <DashDateRangeComponent onDateRangeChange={onDateRangeChange} />
        </Grid>
      </Grid> */}

      <Grid container>
        <Grid item xs={12}>
          <Suspense fallback={<div>loading... </div>}>
            {renderComponent()}
          </Suspense>
        </Grid>
      </Grid>
    </>
  );
};

export default NewSalesReportMain;
