import React from "react";
import "./App.css";
import { debugData } from "../utils/debugData";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  return (
    <div className="nui-wrapper">
      <div className="content">
        <div>
          <h1>Hi!</h1>
          <p>Exit with the escape key</p>
        </div>
      </div>
    </div>
  );
};

export default App;
