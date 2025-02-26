const DownloadReport = () => {
  const handleDownload = () => {
    window.open("http://localhost:5000/api/report/pdf", "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "blue",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Download Betting Report (PDF)
    </button>
  );
};

export default DownloadReport;
