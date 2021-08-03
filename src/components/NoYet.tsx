import { Card, CardHeader } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import PropTypes from 'prop-types';

interface NoYetProps {
  type?: string
}

const NoYet: React.FC<NoYetProps> = ({ type }) => (
  <Card>
    <CardHeader
      avatar={<Info />}
      title={`No ${type}s yet`}
      subheader={`You can add your first ${type} using the red button`}
    />
  </Card>
);

NoYet.propTypes = {
  type: PropTypes.string,
};

NoYet.defaultProps = {
  type: 'Thing',
};

export default NoYet;
