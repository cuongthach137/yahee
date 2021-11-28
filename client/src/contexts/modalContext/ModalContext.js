import React, { useState } from "react";
import ProductPreview from "../../components/Modals/ProductPreview";
import ResponsiveDialog from "../../components/Modals/Dialog";
import Drawer from "../../components/Modals/Drawer";
import EditProduct from "../../components/Modals/EditProduct";
import { useLocation } from "react-router-dom";
export const ModalContext = React.createContext();
export const ActionContext = React.createContext();
export const EditModalContext = React.createContext();
export const EditingContext = React.createContext();
export const ProductContext = React.createContext();
export const MessageContext = React.createContext();
export const ConfirmContext = React.createContext();
export const ProductIdContext = React.createContext();
export const ModalOpenContext = React.createContext();

export const ModalProvider = ({ children }) => {
  const { pathname } = useLocation();

  const [title] = useState("Confirmation Needed");
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [product, setProduct] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleMessage = (message) => {
    switch (message) {
      case "deleteProduct":
        return setMessage(
          "You are about to remove this product. This action is permanent! "
        );
      case "rateWithoutComment":
        return setMessage(
          "You are sending a rating without a comment. Are you sure?"
        );
      case "deleteCoupon":
        return setMessage("You are about to remove this coupon. Are you sure?");

      default:
        return;
    }
  };
  const handleModalState = (actionToHandle) => {
    switch (actionToHandle) {
      case "openPreview":
        return setOpenPreview(true);
      case "closePreview":
        return setOpenPreview(false);
      case "openDialog":
        return setOpenDialog(true);
      case "closeDialog":
        return setOpenDialog(false);
      case "openDrawer":
        return setOpenDrawer(true);
      case "closeDrawer":
        return setOpenDrawer(false);
      case "openEdit":
        return setOpenEdit(true);
      case "closeEdit":
        return setOpenEdit(false);
      default:
        return;
    }
  };

  return (
    <ModalContext.Provider value={handleModalState}>
      {product && (
        <ProductPreview
          product={product}
          handleClose={handleModalState}
          open={openPreview}
        />
      )}

      <EditProduct
        product={product}
        handleState={handleModalState}
        state={openEdit}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
      />
      <ResponsiveDialog
        title={title}
        message={message}
        setConfirm={setConfirm}
        confirm={confirm}
        handleState={handleModalState}
        open={openDialog}
      />

      {pathname.startsWith("/admin") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register") ||
      pathname.startsWith("/user/messenger") ? (
        ""
      ) : (
        <Drawer
          handleMessage={handleMessage}
          handleState={handleModalState}
          open={openDrawer}
          setConfirm={setConfirm}
          confirm={confirm}
        />
      )}

      <ProductContext.Provider value={[product, setProduct]}>
        <MessageContext.Provider value={handleMessage}>
          <ConfirmContext.Provider value={[confirm, setConfirm]}>
            <ModalOpenContext.Provider value={[isModalOpen, setIsModalOpen]}>
              <EditingContext.Provider value={[isEditing, setIsEditing]}>
                {children}
              </EditingContext.Provider>
            </ModalOpenContext.Provider>
          </ConfirmContext.Provider>
        </MessageContext.Provider>
      </ProductContext.Provider>
    </ModalContext.Provider>
  );
};
