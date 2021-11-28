import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "../../styles/override/TextField";
import { Controller, useFormContext } from "react-hook-form";

const Input = ({
  name,
  shouldUnregister = false,
  label,
  defaultValue,
  adornment,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className={`productInfo__${name}`}>
      <Controller
        shouldUnregister={shouldUnregister}
        name={name}
        control={control}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <>
            <TextField
              type="text"
              label={label}
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors[name]}
              helperText={errors[name]?.message}
              InputProps={{
                startAdornment: adornment && (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                step: 0.1,
              }}
              {...field}
              {...rest}
            />
          </>
        )}
      />
    </div>
  );
};

export default Input;
