import React, { useEffect, useState, useRef } from "react";

import Popover from '@mui/material/Popover';
import { Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import { MdOutlineTune } from "react-icons/md";
import TuneIcon from '@mui/icons-material/Tune';
import { width } from "@mui/system";
const InventoryFilter = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const isActive = (option) => {
        return option === activeOption;
    };

    const setActive = (option) => {
        setActiveOption(option);
    };

    const [activeOption, setActiveOption] = useState("By Month");

    const setDatesBasedOnOption = (option) => {
        const today = new Date();
        const dayBeforeDay = new Date();
        switch (option) {
            case "By Month":
                setStartDate(today);
                setEndDate(today);
                break;
            case "By Weekday":
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
            case "By Hour":
                const last7Days = new Date();
                dayBeforeDay.setDate(today.getDate() - 1);
                last7Days.setDate(today.getDate() - 7);
                setStartDate(last7Days);
                setEndDate(dayBeforeDay);
                break;
            default:
                break;
        }
    };
    return (
        <>
            <div className="q-category-bottom-header">
                <p aria-describedby={id} onClick={handleClick}>
                    <TuneIcon fontSize="small" sx={{ marginRight: 1 }} />
                    Filter
                </p>
            </div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '8px', // Adjust border radius
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Custom shadow
                    },
                }}
            >

                <div style={{ padding: 20, borderRadius: 20 }}>
                    <p className="mb-3" style={{ fontSize: 16, fontWeight: '700' }}>Arrange columns</p>
                    <Grid item className="datarange_days_order px-6 mb-3">
                        {["By Month", "By Weekday", "By Hour"].map(
                            (option) => (
                                <div
                                    key={option}
                                    className={`order_Details_days ${isActive(option) ? "text-blue-500" : "text-gray-600"
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
                    <div style={{ width: '100%', textAlign: 'right', marginTop: 10 }}>
                        <button className="save_btn" style={{ width: 100, padding: 0 }}>
                            Apply
                        </button>
                    </div>
                </div>
            </Popover>


        </>
    );
};

export default InventoryFilter;
