import PropTypes from 'prop-types';
import React from 'react'

class BigPicture extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { id, name } = this.props;
    return (
      <div>
        <img src={`/api/v1/picture/${id}/`} alt={name} className='big-image' />
      </div>
    )
  }
}

BigPicture.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
};

export default BigPicture
