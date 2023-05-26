import React from 'react';
import { render } from 'react-dom';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logname: "",
      pictures: []
    }
  }

  componentDidMount() {
    fetch('/api/v1/pictures/', { credentials: 'same-origin', method: 'POST' })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      this.setState({
        logname: data.logname,
        pictures: data.pictures
      });
    })
    .catch((error) => console.log(error));
  }

  render() {
    const { logname, pictures } = this.state;
    return (
      <div>
        <h1>{logname}</h1>
        {
          pictures.forEach((picture) => {
            <><img src={picture.fileid} alt={picture.name} /><h2>{picture.name}</h2></>
          })
        }
      </div>
    )
  }
}

render(
  <Index />,
  document.getElementById('reactEntry')
)