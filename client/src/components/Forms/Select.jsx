import {
  FormControl,
  InputLabel,
  Select as SelectMui,
} from "@material-ui/core";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import capitalize from "../../functions/capitalize";

const Select = ({ name, options, value, method }) => {
  const { control, setValue } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{capitalize(name)}</InputLabel>
            <SelectMui
              {...field}
              onChange={(event) => {
                method && method(event.target.value);
                setValue(name, event.target.value);
              }}
              native
              value={value}
            >
              {options &&
                options.length > 0 &&
                options.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name}
                  </option>
                ))}
            </SelectMui>
          </FormControl>
        )}
      />
    </>
  );
};

export default Select;
