import React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      valueIsNumericString
    />
  );
});

NumericFormatCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default function NumericInput({onChange, ...props}) {
  const [value, setValue] = React.useState();

  const handleChange = (v) => {
    setValue(v)
    onChange(v)
  }

  return (
      <TextField
        {...props}
        value={value || 0}
        onChange={(e) => handleChange(e.target.value)}
        InputProps={{
          inputComponent: NumericFormatCustom
        }}
      />
  );
}