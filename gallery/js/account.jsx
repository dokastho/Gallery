import React from 'react';
import { render } from 'react-dom';
import Topbar from './topbar';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {},
      loaded: false,
    }
  }

  componentDidMount() {
    // fetch account info
    fetch('/api/v1/account/', { credentials: 'same-origin', method: 'POST' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log("state from api");
        console.log(data);
        this.setState({
          accountInfo: data.accountInfo,
          loaded: true,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { accountInfo, loaded } = this.state;
    return (
      <><Topbar logname={''} /><div className='account-background'>
        <div className='account-view'>
          {
            loaded ? (
              <div className='accout-info'>
                <img className='profile-pic' src={`/api/v1/picture/${accountInfo.filename}/`} />
                <h1>{accountInfo.fullname}</h1><h2>@{accountInfo.username}</h2>
                <p>user as of {accountInfo.created}</p>
              </div>
            ) : null
          }
          <h2>Account Settings</h2>
          <form action="/accounts/logout/" method="post">
            <input type="submit" value="logout" />
          </form>
          <br />
          <a href="/accounts/password/">Change password</a><br />
          <a href="/accounts/delete/">Delete account</a><br />
        </div>
      </div></>
    )
  }
}

render(
  <AccountPage />,
  document.getElementById("reactEntry"),
);