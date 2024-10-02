import React, { useEffect, useState, useRef } from "react";

import Popover from '@mui/material/Popover';
import { Checkbox, Grid } from "@mui/material";
import plusIcon from "../../../Assests/Products/plusIcon.svg";
import Grow from '@mui/material/Grow';
import CheckBoxField from "../../../reuseableComponents/CheckBoxField";
import { display } from "@mui/system";

const FirstButtonSelections = ({ selectedColumns, setSelectedColumns, applyColumns, setShowColumnPopup }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [selectAllColumns, setSelectAllColumns] = useState(false);

    // Handle checkbox changes for column selections
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedColumns((prev) => ({ ...prev, [name]: checked }));
    };

  // Handle Select All checkbox
  const handleSelectAllChange = (event) => {
    const { checked } = event.target;
    setSelectAllColumns(checked);
    const updatedColumns = {
      supplierCode: checked,
      brand: checked,
      supplier: checked,
      category: checked,
    };
    setSelectedColumns(updatedColumns);
  };

  useEffect(() => {
    const allSelected = selectedColumns.supplierCode && selectedColumns.brand && selectedColumns.supplier && selectedColumns.category;
    setSelectAllColumns(allSelected);
  }, [selectedColumns]);

  return (
    <>
    <div aria-describedby={id} onClick={handleClick}>
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
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        TransitionComponent={Grow}
        sx={{
            '& .MuiPaper-root': {
                borderRadius: '8px', // Adjust border radius
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', // Custom shadow
                width: '320px'
            },
        }}
    >

        <div style={{ paddingBlock: 8, paddingInline: 16, borderRadius: 8, fontSize: 14 }}>
            {/* <p className="mb-3" style={{ backgroundColor: '#F8F8F8', }}>              <Checkbox
                sx={{
                    "& .MuiSvgIcon-root": {
                        borderRadius: '50%',
                        color: '#707070'
                    }
                }}
            /> All</p>
           

            <Grid container className="mb-3">
                {["Supplier code", "Brand", "Supplier", "Category", "Tag"].map(
                    (option) => (

                        <Grid item xs={6} sm={12} md={6}>
                            <Checkbox
                                sx={{
                                    "& .MuiSvgIcon-root": {
                                        borderRadius: '50%',
                                        color: '#707070'
                                    }
                                }}
                            />
                            {option}
                        </Grid>
                    )
                )}
                Comment added
            </Grid>   */}
            <p className="mb-3 d-flex align-center mb-20 padding-2"  style={{ backgroundColor: '#F8F8F8',gap: 12, paddingBlock: 9 }}>
              <input
                type="checkbox"
                checked={selectAllColumns}
                onChange={handleSelectAllChange}
              />
              Select All
          </p>
          
          <Grid container className="mb-3" spacing={3}>
            <Grid item xs={6} sm={12} md={6} sx={{gap: 1.5, alignItems: 'center', display: 'flex'}}>
              
                <input
                  type="checkbox"
                  name="supplierCode"
                  checked={selectedColumns.supplierCode}
                  onChange={handleCheckboxChange}
                />
                Supplier Code
             
            </Grid>
            <Grid item xs={6} sm={12} md={6} sx={{gap: 1.5, alignItems: 'center', display: 'flex'}}>
              
                <input
                  type="checkbox"
                  name="brand"
                  checked={selectedColumns.brand}
                  onChange={handleCheckboxChange}
                />
                Brand
              
            </Grid>
            <Grid item xs={6} sm={12} md={6} sx={{gap: 1.5, alignItems: 'center', display: 'flex'}}>
           
              <input
                type="checkbox"
                name="supplier"
                checked={selectedColumns.supplier}
                onChange={handleCheckboxChange}
              />
              Supplier
           
            </Grid>
            <Grid item xs={6} sm={12} md={6} sx={{gap: 1.5, alignItems: 'center', display: 'flex'}}>
              
                <input
                  type="checkbox"
                  name="category"
                  checked={selectedColumns.category}
                  onChange={handleCheckboxChange}
                />
                Category
              
            </Grid>
          </Grid>
          
      {/* <label>
        <input
          type="checkbox"
          name="supplierCode"
          checked={selectedColumns.supplierCode}
          onChange={handleCheckboxChange}
        />
        Supplier Code
      </label>
      <label>
        <input
          type="checkbox"
          name="brand"
          checked={selectedColumns.brand}
          onChange={handleCheckboxChange}
        />
        Brand
      </label>
      <label>
        <input
          type="checkbox"
          name="supplier"
          checked={selectedColumns.supplier}
          onChange={handleCheckboxChange}
        />
        Supplier
      </label>
      <label>
        <input
          type="checkbox"
          name="category"
          checked={selectedColumns.category}
          onChange={handleCheckboxChange}
        />
        Category
      </label> */}
            <div style={{ width: '100%', marginTop: 10, paddingBottom: 8 }}>
                <button className="btn_blue" style={{ fontSize: 14 }} onClick={() => { applyColumns();  }}>
                    Apply
                </button>
                {/* <button onClick={() => setShowColumnPopup(false)}>Close</button> */}
            </div>
        </div>
    </Popover>
    
    {/* <div className="popup">
      <h2>Select Columns</h2>
      <label>
        <input
          type="checkbox"
          checked={selectAllColumns}
          onChange={handleSelectAllChange}
        />
        Select All
      </label>
      <label>
        <input
          type="checkbox"
          name="supplierCode"
          checked={selectedColumns.supplierCode}
          onChange={handleCheckboxChange}
        />
        Supplier Code
      </label>
      <label>
        <input
          type="checkbox"
          name="brand"
          checked={selectedColumns.brand}
          onChange={handleCheckboxChange}
        />
        Brand
      </label>
      <label>
        <input
          type="checkbox"
          name="supplier"
          checked={selectedColumns.supplier}
          onChange={handleCheckboxChange}
        />
        Supplier
      </label>
      <label>
        <input
          type="checkbox"
          name="category"
          checked={selectedColumns.category}
          onChange={handleCheckboxChange}
        />
        Category
      </label>
      <button onClick={applyColumns}>Apply</button>
      <button onClick={() => setShowColumnPopup(false)}>Close</button>
    </div>  */}
    </>
  );
};

export default FirstButtonSelections;
