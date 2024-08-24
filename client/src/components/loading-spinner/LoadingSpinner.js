import Spinner from "react-bootstrap/Spinner";

function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center h-100 w-100 py-8">
      <Spinner animation="border" role="status" />
    </div>
  );
}

export default LoadingSpinner;
