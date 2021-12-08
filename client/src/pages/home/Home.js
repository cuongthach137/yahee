import React, { useEffect } from "react";
import CategoryArea from "../../components/CategoryArea/CategoryArea.component";
import BestSellerArea from "../../components/BestSellerArea/BestSellerArea";
import SeenProducts from "../../components/SeenProducts/SeenProducts";
import { useHistory } from "react-router-dom";
const Home = () => {
  const history = useHistory();
  useEffect(() => {
    document.title = "C9STORE - HIGH LIKE ON C9";
    history.push("/user/messenger");
  }, []);

  return (
    <>
      <CategoryArea />
      <BestSellerArea />
      <SeenProducts />
    </>
  );
};

export default Home;
