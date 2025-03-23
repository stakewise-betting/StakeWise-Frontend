import React from "react";

interface DownloadReportProps {
  adminProfit?: string;
}

const DownloadReport: React.FC<DownloadReportProps> = ({
  adminProfit = "0",
}) => {
  const handleDownloadReport = () => {
    // Open the PDF report in a new tab
    window.open(
      `http://localhost:5000/api/report/pdf?adminProfit=${adminProfit}`,
      "_blank"
    );
  };

  return (
    <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-black">Admin Reports</h2>
      <div className="mb-4">
        <p className="text-gray-700">
          Generate detailed reports including event statistics and profit
          information.
        </p>
        <p className="text-gray-700 font-semibold mt-2">
          Current admin profit: {adminProfit} ETH
        </p>
      </div>
      <button
        onClick={handleDownloadReport}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
      >
        Download Report (PDF)
      </button>
    </div>
  );
};

export default DownloadReport;
