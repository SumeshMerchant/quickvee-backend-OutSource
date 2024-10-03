import React, { useState } from 'react';
import { Box, Button, Checkbox, Container, Grid, Typography, Grow } from '@mui/material';
import Dialog from '@mui/material/Dialog';

// const TransitionComponent = forwardRef(function Transition(props, ref) {
//   return <Grow  in={props.in} timeout={500} ref={ref} {...props} />;
// });

const InventoryTableColumns = ({ open, handleClose , selectedColumns, setSelectedColumns, applyMeasures, setShowMeasurePopup}) => {
  // const { onClose, selectedValue, open } = props;

 

  // const handleListItemClick = (value: string) => {
  //   onClose(value);
  // };
  // Handle checkbox changes for measure selections
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedColumns((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <>
    <Dialog
      // maxWidth={'lg'}
    
      // TransitionComponent={TransitionComponent}
      onClose={handleClose}
      open={open}
      keepMounted
      PaperProps={{
        style: {
          height: '652px', // Fixed height
          maxHeight: '80vh', // Maximum height for responsiveness
          maxWidth: '64.3vw',
          left: '21vw'
        },
        sx: {
          boxShadow: '0px 3px 6px #00000029',
          position: 'absolute',
          top: 0,
        },
      }}
      BackdropProps={{
        style: { backgroundColor: open ? 'transparent' : 'transparent' }, // Set backdrop color to transparent
      }}
    >
      <div className="measure-container">
        <Grid container className="align-center px30-py15" sx={{position: 'sticky', background: '#fff', top: 0}}>
          <Grid item xs={7}>
            <h5 className="dialog-heading">Choose other measure to show</h5>
          </Grid>
          <Grid item xs={5} sx={{gap:2}} container className="d-flex flex-end">
            <button className="btn btn-gray" onClick={handleClose}>Cancel</button>
            <button className="btn btn-blue" onClick={applyMeasures}>Apply</button>
          </Grid>
        </Grid>
        <Box className="d-flex align-center pl-30 mb-10">
          <h6 className="form-title-head pr-20">Sale</h6>
          <div className="line-through"></div>
        </Box>
        <Grid container className="px-30 mb-20" spacing={4}>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="net_sale"
                  checked={selectedColumns?.net_sale}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Net Sale</h6>
                <p className="sub-title">Total value of items sold</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              
                <input
                  type="checkbox"
                  name="gross_profit"
                  checked={selectedColumns?.gross_profit}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Gross profit</h6>
                <p className="sub-title">
                  Total revenue in the specified period less the total cost of
                  products sold for that period
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
                

                <input
                  type="checkbox"
                  name="sale_margin"
                  checked={selectedColumns?.sale_margin}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Margin (%)</h6>
                <p className="sub-title">
                Percentage of revenue that you keep as gross profit
                </p>
              </Grid>
            </Grid>
          </Grid>
         <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="customer_count"
                  checked={selectedColumns?.customer_count}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Customer count</h6>
                <p className= "sub-title">
                Number of unique registered customers served in the specified period
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="sale_count"
                  checked={selectedColumns?.sale_count}
                  onChange={handleCheckboxChange}
                />              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Sale count</h6>
                <p className= "sub-title">
                Total number of sales and returns
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
                <input type="checkbox" />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Items sold</h6>
                <p className= "sub-title">
                Total number of items sold
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="items_sold_per_day"
                  checked={selectedColumns?.items_sold_per_day}
                  onChange={handleCheckboxChange}
                /> 
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Items sold per day</h6>
                <p className= "sub-title">
                Average number of items sold per day
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="avg_items_per_sale"
                  checked={selectedColumns?.avg_items_per_sale}
                  onChange={handleCheckboxChange}
                /> 
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Avg. items per sale</h6>
                <p className= "sub-title">
                Average number of items per sale
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="avg_sale_value"
                  checked={selectedColumns?.avg_sale_value}
                  onChange={handleCheckboxChange}
                />               </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Avg. sale value</h6>
                <p className= "sub-title">
                Average transaction/sale value
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="sale_discounted"
                  checked={selectedColumns?.sale_discounted}
                  onChange={handleCheckboxChange}
                />  
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Discounted (%)</h6>
                <p className= "sub-title">
                Average discount given on total sale value (excl. tax)
                </p>
              </Grid>
            </Grid>
          </Grid>
          
          
        </Grid>
        <Box className="d-flex align-center pl-30 mb-10">
          <h6 className="form-title-head pr-20">Product prices & value</h6>
          <div className="line-through"></div>
        </Box>
        <Grid container className="px-30 mb-20" spacing={4}>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="avgCostMeasure"
                  checked={selectedColumns?.avgCostMeasure}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Avg. cost</h6>
                <p className="sub-title">Average supply price of a single item</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="inventory_cost"
                  checked={selectedColumns?.inventory_cost}
                  onChange={handleCheckboxChange}
                />             
                 </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Inventory cost</h6>
                <p className="sub-title">
                Total value of inventory on hand using average cost
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="cost_goods_sold"
                  checked={selectedColumns?.cost_goods_sold}
                  onChange={handleCheckboxChange}
                />             
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Cost of goods sold</h6>
                <p className="sub-title">
                Total cost of products sold
                </p>
              </Grid>
            </Grid>
          </Grid>
         <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="retail_value"
                  checked={selectedColumns?.retail_value}
                  onChange={handleCheckboxChange}
                />  
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Retail value (excl. tax)</h6>
                <p className= "sub-title">
                Total value of inventory on hand using retail price</p>
              </Grid>
            </Grid>
          </Grid>
          
          
          
        </Grid>
        <Box className="d-flex align-center pl-30 mb-10">
          <h6 className="form-title-head pr-20">Inventory levels</h6>
          <div className="line-through"></div>
        </Box>
    
        <Grid container className="px-30 mb-20" spacing={4}>
        <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="current_inventory"
                  checked={selectedColumns?.current_inventory}
                  onChange={handleCheckboxChange}
                />  
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Current inventory</h6>
                <p className="sub-title">
                Amount of inventory as of today
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="start_date_inventory"
                  checked={selectedColumns?.start_date_inventory}
                  onChange={handleCheckboxChange}
                />  
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Start date inventory</h6>
                <p className="sub-title">Amount of inventory as of the start of chosen dates</p>
              </Grid>
            </Grid>
          </Grid>
      
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="reorder_point"
                  checked={selectedColumns?.reorder_point}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Reorder point</h6>
                <p className="sub-title">
                Threshold for inventory being low
                </p>
              </Grid>
            </Grid>
          </Grid>
         <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="reorder_amount"
                  checked={selectedColumns?.reorder_amount}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Reorder amount</h6>
                <p className= "sub-title">
                Default quantity ordered when added to a purchase order</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="inbound_inventory"
                  checked={selectedColumns?.inbound_inventory}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Inbound inventory</h6>
                <p className="sub-title">
                Amount of incoming inventory from dispatched purchase orders and sent transfers
                </p>
              </Grid>
            </Grid>
          </Grid>
          
          
        </Grid>
        <Box className="d-flex align-center pl-30 mb-10">
          <h6 className="form-title-head pr-20">Inventory performance</h6>
          <div className="line-through"></div>
        </Box>
    
        <Grid container className="px-30 mb-20" spacing={4}>
        <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="selfThroughRate"
                  checked={selectedColumns?.selfThroughRate}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Sell-through rate</h6>
                <p className="sub-title">
                Percentage of solid items out of all items available to be sold
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="return_count"
                  checked={selectedColumns?.return_count}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Return count</h6>
                <p className="sub-title">Numbers of sold items returned by customers</p>
              </Grid>
            </Grid>
          </Grid>
      
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="inventory_days_cover"
                  checked={selectedColumns?.inventory_days_cover}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Days cover</h6>
                <p className="sub-title">
                Estimated number of days current inventory will last
                </p>
              </Grid>
            </Grid>
          </Grid>
         <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="inventory_returns"
                  checked={selectedColumns?.inventory_returns}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Returns (%)</h6>
                <p className= "sub-title">
                Percentage of sold items that have been returned by customers</p>
              </Grid>
            </Grid>
          </Grid>
         
          
          
        </Grid>
        <Box className="d-flex align-center pl-30 mb-10">
          <h6 className="form-title-head pr-20">Dates</h6>
          <div className="line-through"></div>
        </Box>
    
        <Grid container className="px-30 mb-20" spacing={4}>
        <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="created"
                  checked={selectedColumns?.created}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Created</h6>
                <p className="sub-title">
                Date this product was first added to your store
                </p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                    type="checkbox"
                    name="firstSale"
                    checked={selectedColumns?.firstSale}
                    onChange={handleCheckboxChange}
                  />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">First sale</h6>
                <p className="sub-title">Date of the first sale</p>
              </Grid>
            </Grid>
          </Grid>
      
          <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                  type="checkbox"
                  name="lastSale"
                  checked={selectedColumns?.lastSale}
                  onChange={handleCheckboxChange}
                />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Last sale</h6>
                <p className="sub-title">
                Date of the last sale
                </p>
              </Grid>
            </Grid>
          </Grid>
         <Grid item xs={12} sm={4} md={3}>
            <Grid container sx={{ display: "flex", gap: 1.5 }}>
              <Grid item>
              <input
                    type="checkbox"
                    name="lastReceived"
                    checked={selectedColumns?.lastReceived}
                    onChange={handleCheckboxChange}
                  />
              </Grid>
              <Grid item xs={10}>
                <h6 className="form-title">Last received</h6>
                <p className= "sub-title">
                Date this product was last received on a purchase OrderSource</p>
              </Grid>
            </Grid>
          </Grid>
         
          
          
        </Grid>
     
      </div>
    </Dialog> 
    
    </>
  );
}

export default InventoryTableColumns;