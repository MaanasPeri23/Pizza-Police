const SuccessMessage = ({ onNewResponse }) => {
    return (
      <div className="success-message">
        <h2>Congrats on filling the form!</h2>
        <p>Your report has been submitted successfully.</p>
        <button onClick={onNewResponse} className="submit-button">
          Submit Another Response
        </button>
      </div>
    );
  };

export default SuccessMessage;