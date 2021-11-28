import React, { useContext, useEffect, useState } from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Form from "../../../../components/Forms/Form";
import Input from "../../../../components/Forms/Input";

import Chip from "../../../../styles/override/Chip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import "./CreateCoupon.styles.scss";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
} from "../../../../functions/couponFunctions";
import { toast } from "react-toastify";
import {
  ConfirmContext,
  MessageContext,
  ModalContext,
} from "../../../../contexts/modalContext/ModalContext";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    color: "red",
  },
});

const CreateCoupon = () => {
  const classes = useStyles();
  const handleModalState = useContext(ModalContext);
  const handleMessage = useContext(MessageContext);
  const [confirm, setConfirm] = useContext(ConfirmContext);
  const [couponId, setCouponId] = useState();
  const methods = useForm({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });
  console.log(confirm);

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { isSubmitSuccessful },
  } = methods;
  const [coupons, setCoupons] = useState([]);

  async function onSubmit(data) {
    try {
      const res = await createCoupon(data);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async function getCoupons() {
      const res = await listCoupons();
      setCoupons(res.data.coupons);
    })();
  }, [setCoupons, confirm]);
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        startDate: new Date(),
        endDate: new Date(),
        name: "",
        discount: "",
      });
      (async function getCoupons() {
        const res = await listCoupons();
        setCoupons(res.data.coupons);
      })();
    }
  }, [reset, methods.formState, isSubmitSuccessful]);
  useEffect(() => {
    if (confirm) {
      deleteCoupon(couponId);
      (async function getCoupons() {
        const res = await listCoupons();
        setCoupons(res.data.coupons);
      })();
    }
  }, [confirm, couponId]);
  return (
    <div className="createCoupon">
      <div className="createCoupon__form">
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="stack">
              <Input
                name="name"
                label="Coupon Name"
                defaultValue={getValues("name")}
              />
              <Input
                name="discount"
                label="Discount (%)"
                defaultValue={getValues("discount")}
              />
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <KeyboardDatePicker
                    {...field}
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="startDate"
                    label="Start Date"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <KeyboardDatePicker
                    {...field}
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="endDate"
                    label="End Date"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                )}
              />
              <div className="createBtn">
                <button className="btn primary-btn">Creates</button>
              </div>
            </div>
          </Form>
        </FormProvider>
      </div>
      <div className="createCoupon__list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Discount</th>
              <th>Start Date</th>
              <th>Exp Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons &&
              coupons.length > 0 &&
              coupons.map((coupon) => (
                <tr key={coupon.startDate}>
                  <td>{coupon.name}</td>
                  <td>{coupon.discount}%</td>
                  <td>{new Date(coupon.startDate).toLocaleString("vi-VI")}</td>
                  <td>{new Date(coupon.endDate).toLocaleString("vi-VI")}</td>
                  <td>
                    {Date.now() - new Date(coupon.endDate) < 0 ? (
                      <Chip label="Active" color="primary" />
                    ) : (
                      <Chip label="Expired" color="secondary" />
                    )}
                  </td>
                  <td>
                    <IconButton
                      onClick={() => {
                        handleModalState("openDialog");
                        handleMessage("deleteCoupon");
                        setConfirm(false);
                        setCouponId(coupon._id);
                      }}
                      clickable="true"
                      aria-label="delete"
                    >
                      <DeleteIcon className={classes.root} />
                    </IconButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CreateCoupon;
