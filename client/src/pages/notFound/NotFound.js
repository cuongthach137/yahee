import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./NotFound.styles.scss";

const NotFound = ({ children }) => {
  const history = useHistory();
  const [countDown, setCountDown] = useState(10);
  document.title = "Page Not Found";

  useEffect(() => {
    if (countDown < 1) {
      history.push("/");
    }
    const timeout = setTimeout(() => {
      setCountDown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [countDown, history]);

  return (
    <div className="container">
      <div className="not-found">
        <h1>404</h1>
        <p>
          {children}. Redirecting you back to <Link to="/">home page</Link> in{" "}
          {countDown}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
