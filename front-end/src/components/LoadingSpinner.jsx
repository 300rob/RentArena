const LoadingSpinner = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  overlay: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 9999,
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e5e5e5",
    borderTop: "4px solid #000000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#000000",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
};

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`, styleSheet.cssRules.length);

export default LoadingSpinner;