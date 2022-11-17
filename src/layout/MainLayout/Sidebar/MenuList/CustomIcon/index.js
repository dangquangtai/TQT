import React from 'react';
import * as Icons from '@material-ui/icons';
import SvgIcon from '@material-ui/core/SvgIcon';
import useStyles from './../../../../../utils/classes';

const CustomIcon = ({ type, name, svg, base64, className }) => {
  const classes = useStyles();
  const IconComponent = Icons[name];

  if (type === 'SVG' && svg) {
    return (
      <SvgIcon className={className}>
        <g dangerouslySetInnerHTML={{ __html: svg }} />
      </SvgIcon>
    );
  }

  if (type === 'BASE64' && base64) {
    return <img src={base64} alt={name} className={classes.iconBase64} />;
  }

  if (!name || !IconComponent) {
    return <Icons.FolderOpen className={className} />;
  }

  return <IconComponent className={className} />;
};

export default CustomIcon;
