import React from 'react';
import PropTypes from 'prop-types';

class Picture extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, name, index, thumbnailBlowUp } = this.props;
    return (
      <div>
        <img src={`/api/v1/foo/${id}/`} alt={name} className='image' onClick={() => {thumbnailBlowUp(index)}} />
      </div>
    )
  }
}

Picture.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default Picture
