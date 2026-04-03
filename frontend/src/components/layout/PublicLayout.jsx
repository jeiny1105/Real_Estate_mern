import { Outlet } from "react-router-dom";
import Header from "../layout/Header";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicLayout;
