import React from 'react';
import { DatePicker as Picker } from '@material-ui/pickers';
import { InputAdornment } from '@material-ui/core';
import { CalendarToday as CalendarTodayIcon } from '@material-ui/icons';

const DatePicker = ({ date, onChange, disabled = false }) => {
  return (
    <Picker
      autoOk
      variant="inline"
      inputVariant="outlined"
      size="small"
      fullWidth
      format="dd/MM/yyyy"
      value={date}
      onChange={onChange}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CalendarTodayIcon />
          </InputAdornment>
        ),
      }}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default DatePicker;
