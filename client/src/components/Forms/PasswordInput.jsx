import React, { useState } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "../../styles/override/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
const PasswordInput = ({ name, label }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`productInfo__${name}`}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            type={name}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            variant="outlined"
            margin="normal"
            fullWidth
            InputProps={{
              type: showPassword ? "text" : "password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default PasswordInput;
