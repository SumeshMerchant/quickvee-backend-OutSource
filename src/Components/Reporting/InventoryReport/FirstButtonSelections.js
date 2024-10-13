import React, { useEffect, useState, useRef } from "react";

import Popover from '@mui/material/Popover';
import { Checkbox, Grid } from "@mui/material";
import plusIcon from "../../../Assests/Products/plusIcon.svg";
import Grow from '@mui/material/Grow';

const FirstButtonSelections = ({ columnsOptions, selectedColumns, setSelectedColumns, applyColumns, dataLength }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectAllColumns, setSelectAllColumns] = useState(false);
  // Open/Close popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Handle individual column checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedColumns((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle "Select All" checkbox
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectAllColumns(checked);
    const updatedColumns = columnsOptions.reduce((acc, col) => {
      acc[col.id] = checked;
      return acc;
    }, {});
    setSelectedColumns(updatedColumns);
  };

  // Sync "Select All" checkbox based on selectedColumns
  useEffect(() => {
    const allSelected = columnsOptions.every((col) => selectedColumns[col.id]);
    setSelectAllColumns(allSelected);
  }, [selectedColumns, columnsOptions]);

  return (
    <>
      <div aria-describedby={id} onClick={dataLength > 0 ? handleClick : null}>
        <img
          style={{ height: "40px", width: "40px" }}
          src={plusIcon}
          alt="plusIcon"
        />
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Grow}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            width: "320px",
          },
        }}
      >
        <div style={{ paddingBlock: 8, paddingInline: 8, borderRadius: 8, fontSize: 14 }}>
          <p
            className="mb-3 d-flex align-center mb-20 padding-2"
            style={{ backgroundColor: "#F8F8F8", gap: 12, padding: 9 }}
          >
            <input
              type="checkbox"
              checked={selectAllColumns}
              onChange={handleSelectAllChange}
            />
            Select All
          </p>

          <Grid container className="mb-3" sx={{ pl: 1 }} spacing={3}>
            {columnsOptions.map((col,index) => (
              <Grid key={index} item xs={6} sm={12} md={6} sx={{ gap: 1.5, alignItems: "center", display: "flex" }}>
                <input
                  type="checkbox"
                  name={col.id}
                  checked={selectedColumns[col.id] || false}
                  onChange={handleCheckboxChange}
                />
                {col.name}
              </Grid>
            ))}
          </Grid>

          <div style={{ width: "100%", marginTop: 10, paddingBottom: 8 }}>
            <button
              className="btn_blue"
              style={{ fontSize: 14 }}
              onClick={() => {
                applyColumns();
                handleClose();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default FirstButtonSelections;
