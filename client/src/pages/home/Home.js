import React, { useEffect } from "react";
import CategoryArea from "../../components/CategoryArea/CategoryArea.component";
import BestSellerArea from "../../components/BestSellerArea/BestSellerArea";
import SeenProducts from "../../components/SeenProducts/SeenProducts";
const Home = () => {
  useEffect(() => {
    document.title = "C9STORE - HIGH LIKE ON C9";
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
