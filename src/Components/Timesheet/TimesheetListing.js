import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import AddIcon from "../../Assests/Category/addIcon.svg";
import AddNewCategory from "../../Assests/Taxes/Left.svg";
import CrossIcon from "../../Assests/Dashboard/cross.svg";
import caleIcon from "../../Assests/Filter/Calender.svg";
import TimeIcon from "../../Assests/Filter/Clock.svg";
import DeleteIcon from "../../Assests/Category/deleteIcon.svg";
import BasicTextFields from "../../reuseableComponents/TextInputField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Grid from "@mui/material/Grid";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Box, Modal } from "@mui/material";
import { fetchtimeSheetData } from "../../Redux/features/Timesheet/timesheetSlice";
import axios from "axios";
import { BASE_URL, EMPLOYEE_LIST } from '../../Constants/Config';

const TimesheetListing = ({ data }) => {

  const dispatch = useDispatch();
  const [timesheet, settimesheet] = useState([]);
  const [employeeList, setemployeeList] = useState([]);
  const [EmployeeName, setEmployeeName] = useState(""); 
  const timeSheetDataState = useSelector((state) => state.timeSheet);

  useEffect(() => {
    dispatch(fetchtimeSheetData(data));
  }, [dispatch, data]);

  useEffect(() => {
    if (!timeSheetDataState.loading && timeSheetDataState.timeSheetData) {
      settimesheet(timeSheetDataState.timeSheetData);
    }
  }, [
    timeSheetDataState,
    timeSheetDataState.loading,
    timeSheetDataState.timeSheetData,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          BASE_URL + EMPLOYEE_LIST,
          { merchant_id: "MAL0100CA" },
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const EmpList = response.data.result;

        const mappedOptions = EmpList.map((empdata) => ({
          id: empdata.id,
          title: empdata.f_name + " " + empdata.l_name,
        }));
        setemployeeList(mappedOptions);

      } catch (error) {
        console.error("Error fetching Employee List:", error);
      }
    };
    fetchData();
  }, []);
  


  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const myStyles = {
    width: "60%",
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "'CircularSTDMedium', sans-serif !important",
  };

  const openModal = (title) => {
    setEmployeeName(title)
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [dateStartError, setDateStartError] = useState("");
  const [dateEndError, setDateEndError] = useState("");
  const [dateStartTimeError, setDateStartTimeError] = useState("");
  const [dateEndTimeError, setDateEndTimeError] = useState("");

  const minutes = Math.round(dayjs().minute() / 15) * 15;
  const roundedTime = dayjs().minute(minutes).second(0);
  // console.log(roundedTime);

  const [addtimebreak, setTimeBreak] = useState({
    merchant_id: "MAL0100CA",
    add_in_date: "",
    add_out_date: "",
    add_clocked_in: "",
    add_clocked_out: "",

    // add_clocked_in: dayjs().format("HH:mm:ss"),
    // add_clocked_out: dayjs().format("HH:mm:ss"),

    // time_valid: roundedTime.format("HH:mm:ss"),
    // time_expire: roundedTime.format("HH:mm:ss"),
  });

  const handleStartTimeChange = (newTime) => {
    setTimeBreak({
      ...addtimebreak,
      add_clocked_in: newTime.format("HH:mm:ss"),
    });
  };
  const handleEndTimeChange = (newTime) => {
    setTimeBreak({
      ...addtimebreak,
      add_clocked_out: newTime.format("HH:mm:ss"),
    });
  };

  const handleStartDateChange = (newDate) => {
    const formattedStartDate = newDate.format("YYYY-MM-DD");
    if (dayjs(formattedStartDate).isAfter(dayjs(addtimebreak.add_out_date))) {
      alert("Start date cannot be greater than the end date");
      setTimeBreak({
        ...addtimebreak,
        add_in_date: null,
      });
      setDateStartError("Select In Date is required");
    } else {
      setTimeBreak({
        ...addtimebreak,
        add_in_date: formattedStartDate,
      });
      setDateStartError("");
    }
  };


  const handleEndDateChange = (newDate) => {
    const formattedEndDate = newDate.format("YYYY-MM-DD");

    if (dayjs(formattedEndDate).isBefore(dayjs(addtimebreak.add_in_date))){
      alert("End date cannot be less than the start date");
      setTimeBreak({
        ...addtimebreak,
        add_out_date: null,
      });
      setDateEndError("Select Out Date is required");
      // return; // Do not update the state
    } else {
      setTimeBreak({
        ...addtimebreak,
        add_out_date: formattedEndDate,
      });
      setDateEndError("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Add ")

  }


  // for Break Modal start
  const [showModalBreak, setShowModalBreak] = useState(false);
  const handleOpenBreak = () => setShowModalBreak(true);
  const handleCloseBreak = () => setShowModalBreak(false);


  const openModalBreak = (title) => {
    setEmployeeName(title)
    setShowModalBreak(true);
  };

  const closeModalBreak = () => {
    setShowModalBreak(false);
  };

  // for Break Modal End
  
  // for All View Break IN/Out Start  
  const [showModalViewBreak, setShowModalViewBreak] = useState(false);
  const handleOpenViewBreak = () => setShowModalViewBreak(true);
  const handleCloseViewBreak = () => setShowModalViewBreak(false);

  const openModalViewBreak = (title) => {
    setEmployeeName(title)
    setShowModalViewBreak(true);
  };

  const closeModalViewBreak = () => {
    setShowModalViewBreak(false);
  };

  // for All View Break IN/Out End


  const renderDataTable = () => {
    if ( timesheet && timesheet.status === false ){
      return <div className="empty-div box"></div>;
    }
    
    // const renderEmployeeData = (employee) => (
    //   <div className="box" key={employee.id}>
    //     <div className="q-attributes-bottom-detail-section">
    //       <div className="mt-6">
    //         <div className="q-attributes-bottom-header bg-[#ffffff]">
    //           <span>{employee.title}</span>
    //           <p onClick={() => openModal(employee.title)}> Add Clock-in/Clock-out<img src={AddIcon} alt="add-icon" />{" "}</p>
    //         </div>
    //         <div className="q-attributes-bottom-attriButes-header">
    //           <p className="q-catereport-item">Date Worked</p>
    //           <p className="q-catereport-item ">Wage Rate</p>
    //           <p className="q-catereport-item">Clock In</p>
    //           <p className="q-catereport-item">Clock Out</p>
    //           <p className="q-catereport-item"></p>
    //         </div>
    //         <div className="q-attributes-bottom-attriButes-listing">
    //           <div className="q-attributes-bottom-attriButes-single-attributes TimesheetRow cursor-pointer" onClick={() => openModalViewBreak(employee.title)}>
    //             <p className="q-catereport-item">05/10/2023</p>
    //             <p className="q-catereport-item">$60</p>
    //             <p className="q-catereport-item">9:50 AM</p>
    //             <p className="q-catereport-item">11:00 PM</p>
    //             <p className="q-catereport-item">
    //               <div className="q-attributes-bottom-header timesheet bg-[#ffffff]">
    //                 <p onClick={(e) => {
    //                   openModalBreak(employee.title);
    //                   e.stopPropagation();
    //                 }}>
    //                   Add Break<img src={AddIcon} alt="add-icon" />{" "}
    //                 </p>
    //               </div>
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );

    const renderEmployeeData = (employee,index) => {
      return (
        <div className="box" key={index}>
          <div className="q-attributes-bottom-detail-section">
            <div className="mt-6">
              <div className="q-attributes-bottom-header bg-[#ffffff]">
                <span>{employee.title}</span>
                <p onClick={() => openModal(employee.title)}> Add Clock-in/Clock-out<img src={AddIcon} alt="add-icon" />{" "}</p>
              </div>
              <div className="q-attributes-bottom-attriButes-header">
                <p className="q-catereport-item">Date Worked</p>
                <p className="q-catereport-item">Wage Rate</p>
                <p className="q-catereport-item">Clock In</p>
                <p className="q-catereport-item">Clock Out</p>
                <p className="q-catereport-item"></p>
              </div>
              <div className="q-attributes-bottom-attriButes-listing">
                <div className="q-attributes-bottom-attriButes-single-attributes TimesheetRow cursor-pointer" onClick={() => openModalViewBreak(employee.title)}>
                  <p className="q-catereport-item">05/10/2023</p>
                  <p className="q-catereport-item">$60</p>
                  <p className="q-catereport-item">9:50 AM</p>
                  <p className="q-catereport-item">11:00 PM</p>
                  <p className="q-catereport-item">
                    <div className="q-attributes-bottom-header timesheet bg-[#ffffff]">
                      <p onClick={(e) => {
                        openModalBreak(employee.title);
                        e.stopPropagation();
                      }}>
                        Add Break<img src={AddIcon} alt="add-icon" />{" "}
                      </p>
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };


    if (!timesheet || data.employee_id === "all") {
      return employeeList.map(renderEmployeeData);
    }
    const selectedEmployee = employeeList.find((employee) => employee.id === data.employee_id);
    // console.log("jxdzbv",selectedEmployee?.title+'_'+selectedEmployee?.id)
    if (selectedEmployee) {
      const name = selectedEmployee?.title+'_'+selectedEmployee.id
      const matchingData = timesheet.data.find((item) => item.key == name);
      if (matchingData) {
        console.log("Matching data:", matchingData);
        // Do something with the matching data
      } else {
        console.log("No matching data found for", name);
      }

      return renderEmployeeData(selectedEmployee);
    }
  };

  return <>
  {renderDataTable()}
  
        {/* Modal for Add Clock-in/ClocK-out start  */}
        <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="view-category-item-modal" style={myStyles}>
            <div className="q-add-categories-section-header text-[18px]" style={{ justifyContent:"space-between" ,fontFamily:"CircularSTDBook" }}>
              <span onClick={() => handleClose()}>
                <img
                  src={AddNewCategory}
                  alt="Timesheet"
                  className="w-6 h-6"
                />
                <span>{EmployeeName}</span>
              </span>
              <p className="viewTextBark">Clock-in/Clock-out</p>
            </div>

            <div className="view-category-item-modal-header">
              <div className="title_attributes_section " style={{margin: "1rem 1rem"}}>

                    <Grid container spacing={3}>
                      <Grid item md={6} xs={6}>
                          <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className="date-provider"
                            >
                              <label htmlFor=" " className="pb-1">Select In Date*</label>
                              <DatePicker
                                onChange={(newDate) =>
                                  handleStartDateChange(newDate)
                                }
                                size="medium"
                                shouldDisableDate={(date) =>
                                  date.format("YYYY-MM-DD") ===
                                  addtimebreak.add_in_date
                                }
                                format={"DD-MM-YYYY"}
                                disablePast
                                views={["year", "month", "day"]}
                                slotProps={{
                                  textField: { placeholder: "Select Date" },
                                }}
                                components={{
                                  OpenPickerIcon: () => (
                                    <img src={caleIcon} alt="calendar-icon" />
                                  ),
                                }}
                                sx={{ width: '100%' }}
                              />
                            </LocalizationProvider>
                            {dateStartError && (
                              <p className="error-message ">
                                {dateStartError}
                              </p>
                            )}
                      </Grid>

                      <Grid item md={6} xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <label htmlFor=" " className="pb-1">Clock In Time*</label>
                                <TimePicker
                                  name="clock_in"
                                  id="clock_in"
                                  slotProps={{
                                    textField: { placeholder: "Select Time" },
                                  }}
                                  onChange={(newTime) =>
                                    handleStartTimeChange(newTime)
                                  }
                                  components={{
                                    OpenPickerIcon: () => (
                                      <img src={TimeIcon} alt="time-icon" />
                                    ),
                                  }}
                                  sx={{ width: '100%' }}
                                />
                          </LocalizationProvider>

                          {dateStartTimeError && (
                                <p className="error-message ">
                                  {dateStartTimeError}
                                </p>
                              )}
                      </Grid>
                     
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} xs={6}>
                          <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className="date-provider"
                            >
                              <label htmlFor=" " className="pb-1">Select Out Date*</label>
                              <DatePicker
                                onChange={(newDate) =>
                                  handleEndDateChange(newDate)
                                }
                                size="medium"
                                shouldDisableDate={(date) =>
                                  date.format("YYYY-MM-DD") ===
                                  addtimebreak.add_clocked_out
                                }
                                format={"DD-MM-YYYY"}
                                disablePast
                                views={["year", "month", "day"]}
                                slotProps={{
                                  textField: { placeholder: "Select Date" },
                                }}
                                components={{
                                  OpenPickerIcon: () => (
                                    <img src={caleIcon} alt="calendar-icon" />
                                  ),
                                }}
                                sx={{ width: '100%' }}
                              />
                            </LocalizationProvider>
                            {dateEndError && (
                                <p className="error-message ">
                                  {dateEndError}
                                </p>
                              )}
                      </Grid>

                      <Grid item md={6} xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <label htmlFor=" " className="pb-1">Clock Out Time*</label>
                                <TimePicker
                                  name="break_in"
                                  id="break_in"
                                  slotProps={{
                                    textField: { placeholder: "Select Time" },
                                  }}
                                  onChange={(newTime) =>
                                    handleEndTimeChange(newTime)
                                  }
                                  components={{
                                    OpenPickerIcon: () => (
                                      <img src={TimeIcon} alt="time-icon" />
                                    ),
                                  }}
                                  sx={{ width: '100%' }}
                                />
                          </LocalizationProvider>
                          {dateEndTimeError && (
                                <p className="error-message ">
                                  {dateEndTimeError} 
                                </p>
                              )}
                      </Grid>
                    </Grid>
                </div>
            </div>

            <div className="q-add-categories-section-middle-footer">
                  <button  className="quic-btn quic-btn-save" onClick={handleSave}>Add</button>
                  <button onClick={closeModal} className="quic-btn quic-btn-cancle">Cancel</button>
            </div>
          </Box>
        </Modal>
        {/* Modal for Add Clock-in/ClocK-out End  */}

        {/* Modal for Break In /Out Start  */}
        <Modal
        open={showModalBreak}
        onClose={handleCloseBreak}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
         >
          <Box className="view-category-item-modal" style={myStyles}>
            <div className="q-add-categories-section-header text-[18px]" 
            style={{ justifyContent:"space-between" ,fontFamily:"CircularSTDBook" }}>
              <span onClick={() => handleCloseBreak()}>
                <img
                  src={AddNewCategory}
                  alt="Timesheet"
                  className="w-6 h-6"
                />
                <span>{EmployeeName}</span>
              </span>
              <div className="viewTextBark">
              <span className="borderRight ">05/10/2023</span> <span className="pl-1"> Break-in/Break-out</span>
              </div>
            </div>

            <div className="view-category-item-modal-header" >
              <div className="title_attributes_section " style={{margin: "1rem 1.5rem"}}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={6}>
                         <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <label  className="pb-1">Break In Time*</label>
                                <TimePicker
                                  name="break_in"
                                  id="break_in"
                                  slotProps={{
                                    textField: { placeholder: "Start Time" },
                                  }}
                                  components={{
                                    OpenPickerIcon: () => (
                                      <img src={TimeIcon} alt="time-icon" />
                                    ),
                                  }}
                                  sx={{ width: '100%' }}
                                />
                          </LocalizationProvider>
                      </Grid>

                      <Grid item md={6} xs={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <label className="pb-1">Break Out Time*</label>
                                <TimePicker
                                  name="break_out"
                                  id="break_out"
                                  slotProps={{
                                    textField: { placeholder: "Start Time" },
                                  }}
                                  components={{
                                    OpenPickerIcon: () => (
                                      <img src={TimeIcon} alt="time-icon" />
                                    ),
                                  }}
                                  sx={{ width: '100%' }}
                                />
                          </LocalizationProvider>
                      </Grid>
                     
                    </Grid>
                </div>
            </div>

            <div className="q-add-categories-section-middle-footer">
                  <button  className="quic-btn quic-btn-save" >Add</button>
                  <button onClick={closeModalBreak} className="quic-btn quic-btn-cancle">Cancel</button>
            </div>
          </Box>
        </Modal>

        {/* Modal for Break In /Out End */}

        {/* Modal for All View Break IN/Out Start  */}
        <Modal
        open={showModalViewBreak}
        onClose={closeModalViewBreak}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
         >
          <Box className="view-category-item-modal" style={myStyles}>
            <div className="q-add-categories-section-header text-[18px]" 
            style={{ justifyContent:"space-between" ,fontFamily:"CircularSTDBook" ,padding:"1rem 1.90rem" }}>
              <span onClick={() => closeModalViewBreak()}>
                <img
                  src={AddNewCategory}
                  alt="Timesheet"
                  className="w-6 h-6"
                />
                <span>{EmployeeName}</span>
              </span>
              <p className="pr-1"><img src={DeleteIcon} alt="delete-icon" className="cursor-pointer" /></p>
            </div>

            <div className="view-category-item-modal-header" >
              <div className="title_attributes_section viewbreak" style={{margin: "1rem 1.5rem"}}>
                 {/* Working Date: 05/10/2023 | Clock In: 09:30 AM | Clock Out: 11:30 PM */}
                 <span className="borderRight">Working Date: <span className="viewTextBark">05/10/2023</span> </span>
                 <span className="borderRight">Clock In: <span className="viewTextBark">09:30 AM</span> </span>
                 <span className="pl-2">Clock Out: <span className="viewTextBark">11:30 PM</span> </span>
              </div>
              
                <div className="viewTaleBreak table__header"> 
                  <p>Break</p>
                  <p>Breaked In</p>
                  <p>Breaked Out</p>
                  <p></p>
                </div>
                <div className="viewTaleBreak viewTableRow ">
                  <p>Break 1</p>
                  <p >4:05 PM</p>
                  <p >4:35 PM</p>
                  <p ><img src={DeleteIcon} alt="delete-icon" className="cursor-pointer" /></p>
                </div>
                <div className="viewTaleBreak viewTableRow ">
                  <p>Break 2</p>
                  <p >8:15 PM</p>
                  <p >8:25 PM</p>
                  <p ><img src={DeleteIcon} alt="delete-icon" className="cursor-pointer" /></p>
                </div>

            </div>

            <div className="q-add-categories-section-middle-footer">
                <button  className="quic-btn quic-btn-save mr-4"  onClick={closeModalViewBreak} >OK</button>
            </div>
          </Box>
        </Modal>
        {/* Modal for All View Break IN/Out End */}
  
  </>;
}

export default TimesheetListing