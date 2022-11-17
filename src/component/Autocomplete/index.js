import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';

export const NoPaddingAutocomplete = withStyles({
  inputRoot: {
    '&&[class*="MuiOutlinedInput-root"]': {
      padding: '8px 12px',
    },
    '&&[class*="MuiOutlinedInput-root"] $input': {
      padding: 0,
    },
  },
  input: {},
})(Autocomplete);
