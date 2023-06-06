import React from 'react';
import { render } from 'react-dom';
import Topbar from './topbar';

render(
  <><Topbar logname={''} /><div className='account-background'>
    <div className='account-view'>
      <h1>Account Settings</h1>
      <form action="/accounts/logout/" method="post">
        <input type="submit" value="logout" />
      </form>
      <br />
      <a href="/accounts/password/">Change password</a><br />
      <a href="/accounts/delete/">Delete account</a><br />
    </div>
  </div></>,
  document.getElementById("reactEntry"),
);