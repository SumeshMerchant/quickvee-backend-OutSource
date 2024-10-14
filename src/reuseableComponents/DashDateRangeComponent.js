import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
// import CalendIcon from "../../../Assests/Filter/Calender.svg";
import CalendIcon from "../Assests/Filter/Calender.svg";
import { padding } from "@mui/system";
import dayjs from "dayjs";
import { Grid } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import SelectDropDown from "./SelectDropDown";
const DashDateRangeComponent = ({
  onDateRangeChange,
  selectedDateRange,
  future_date,
}) => {
  const isDesktopWtdth = useMediaQuery("(max-width:710px)");
  
  const [isTablet, setIsTablet] = useState(false);
  // const today = dayjs();
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(new Date());
  const today = new Date();
  const last7DaysStart = new Date(today);
  last7DaysStart.setDate(today.getDate() - 6); // 7 days ago
  const [startDate, setStartDate] = useState(last7DaysStart);
  const [endDate, setEndDate] = useState(today); // Today's date
  const [futureDateState, setFutureDate] = useState(new Date());
  const startDateRef = React.useRef(null);
  const endDateRef = React.useRef(null);
 
  const handleStartDateIconClick = () => {
    startDateRef.current.setOpen(true);
  };

  const handleEndDateIconClick = () => {
    endDateRef.current.setOpen(true);
  };

  const handleSearch = () => {
    const formatDate = (date) => {
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const dateRangeData = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    onDateRangeChange(dateRangeData);
  };

  const [activeOption, setActiveOption] = useState("Last 7 Days");

  const setActive = (option) => {
    setActiveOption(option);
  };

  const isActive = (option) => {
    return option === activeOption;
  };

  const setDatesBasedOnOption = (option) => {
    const today = new Date();
    switch (option) {
      case "Today":
        setStartDate(today);
        setEndDate(today);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case "Last 7 Days":
        const last7Days = new Date(today);
        const dayBefore = new Date(today); 
        last7Days.setDate(today.getDate() - 6);
        dayBefore.setDate(today.getDate() );
        setStartDate(last7Days);
        setEndDate(dayBefore);
        break;
      case "Last 30 days":
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        setStartDate(last30Days);
        setEndDate(today);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    const today = new Date();
    let gotFurureDate = new Date();
    future_date &&
      setFutureDate(
        gotFurureDate.setDate(today.getDate() + (parseInt(future_date)+1))
      );
  }, [future_date]);
  
  useEffect(() => {
    handleSearch();

    setDatesBasedOnOption(activeOption);
  }, [activeOption]);

  const [selectedReportList, setSelectedReportList] = useState("Main Outlet");

  const selectReportList = [
    {
      title: "Main Outlet",
    },
    {
      title: "Location",
    },
    {
      title: "Category",
    },
  ];

  const handleOptionClick = (option, dropdown) => {
    switch (dropdown) {
      case "reportList":
        setSelectedReportList(option.title);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Grid container sx={{ px: 2.5, pt: 1.6}} className="q-datarange-bottom-detail-section">
        <Grid container justifyContent="space-between" alignItems="center" sx={{mb: 1.2}}>
          <Grid item>
            <div className="date-range-title">
              <h1 className="">Date Range</h1>
            </div>
          </Grid>
          {!isDesktopWtdth ? (
            <>
              <Grid item className="datarange_days_order px-6">
                {["Today", "Yesterday", "Last 7 Days", "Last 30 days"].map(
                  (option) => (
                    <div
                      key={option}
                      className={`order_Details_days ${
                        isActive(option) ? "text-blue-500" : "text-gray-600"
                      }`}
                      onClick={() => {
                        setActive(option);
                        setDatesBasedOnOption(option);
                      }}
                    >
                      {isActive(option) && <div className="dot mr-1" />}
                      {option}
                    </div>
                  )
                )}
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <select
                  className="border-2 p-2 border-customColor rounded bg-white text-blue-500 text-[16px] "
                  onChange={(e) => {
                    const selectedOption = e.target.value;
                    setActive(selectedOption);
                    setDatesBasedOnOption(selectedOption);
                  }}
                >
                  {["Today", "Yesterday", "Last 7 Days", "Last 30 days"].map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                        className={
                          isActive(option) ? "text-blue-500" : "text-gray-600"
                        }
                      >
                        {option}
                      </option>
                    )
                  )}
                </select>
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={2}  className="date-range-custom-parent mb-1">
          <Grid item xs={12} sm={6} md={3} className="date-range-custom">
            <div className="q_date_range_start date-picker-font">
              Start Date
            </div>
            <div className="relative">
              <DatePicker
                sx={{
                  fontFamily: "CircularSTDBook",
                  "& .react-datepicker__input-container input": {
                    "&:focus": {
                      borderColor: "black",
                      outline: "none",
                    },
                  },
                  "& .react-datepicker": {
                    fontFamily: "CircularSTDBook",
                    border: "1px solid black",
                  },
                }}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate}
                dateFormat="MMMM d, yyyy"
                className="q_input_details"
                ref={startDateRef}
                showPopperArrow={false}
              />
              <span
                className="q_cal_daterange"
                onClick={handleStartDateIconClick}
              >
                <img src={CalendIcon} alt="" className="w-6 h-6" />
              </span>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3} className="date-range-custom">
            <div className="q_date_range_start ">End Date</div>
            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={futureDateState ? futureDateState : new Date()} // Set maxDate to today's date
                dateFormat="MMMM d, yyyy"
                className="q_input_details ml-0"
                ref={endDateRef}
                showPopperArrow={false}
                defaultValue={today}
              />
              <span
                className="q_cal_daterange"
                onClick={handleEndDateIconClick}
              >
                <img src={CalendIcon} alt="" className="w-6 h-6" />
              </span>
            </div>

     
          </Grid>
          <Grid item xs={6} sm={12} md={3} className="date-range-custom">
            <label 
              className="q-details-page-label" 
              style={{ marginBlockEnd: 2, marginTop: 0, display: "inline-block" }} 
              
            >
              Outlet
            </label>
            <SelectDropDown
              
              listItem={selectReportList}
              onClickHandler={handleOptionClick}
              selectedOption={selectedReportList}
              dropdownFor={"reportList"}
              title={"title"}
            />
          </Grid>


          <Grid item alignSelf={"center"} >
            <div className="pt-4" style={{float:"inline-end"}}>
              <button onClick={handleSearch} className="save_btn">
                Search
              </button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashDateRangeComponent;
