import React from "react";

const SecondButtonSelections = ({ selectedColumns, setSelectedColumns, applyMeasures, setShowMeasurePopup }) => {
  // Handle checkbox changes for measure selections
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedColumns((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    
    <div className="popup">
      <h2>Select Measures</h2>
      <label>
        <input
          type="checkbox"
          name="net_sale"
          checked={selectedColumns.net_sale}
          onChange={handleCheckboxChange}
        />
        Net Sale
      </label>
      <label>
        <input
          type="checkbox"
          name="avgCostMeasure"
          checked={selectedColumns.avgCostMeasure}
          onChange={handleCheckboxChange}
        />
        Avg Cost
      </label>
      <label>
        <input
          type="checkbox"
          name="sell_through_rate"
          checked={selectedColumns.sell_through_rate}
          onChange={handleCheckboxChange}
        />
        Self Through Rate
      </label>
      <label>
        <input
          type="checkbox"
          name="created"
          checked={selectedColumns.created}
          onChange={handleCheckboxChange}
        />
        Created
      </label>
      <label>
        <input
          type="checkbox"
          name="firstSale"
          checked={selectedColumns.firstSale}
          onChange={handleCheckboxChange}
        />
        First Sale
      </label>
      <label>
        <input
          type="checkbox"
          name="lastSale"
          checked={selectedColumns.lastSale}
          onChange={handleCheckboxChange}
        />
        Last Sale
      </label>
      <label>
        <input
          type="checkbox"
          name="lastReceived"
          checked={selectedColumns.lastReceived}
          onChange={handleCheckboxChange}
        />
        Last Received
      </label>
      <button onClick={applyMeasures}>Apply</button>
      <button onClick={() => setShowMeasurePopup(false)}>Close</button>
    </div>
  );
};

export default SecondButtonSelections;
