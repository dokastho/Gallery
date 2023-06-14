import React from 'react';
import { render } from 'react-dom';
import Topbar from './topbar';

render(
  <>
    <Topbar logname={''} /><div className='account-background'>
      <div className='account-view'>
        <h1>Create An Account</h1>
        <form action="/accounts/?target=/" encType='multipart/form-data' method="post">
          <label htmlFor="username">Username</label><br />
          <input type="text" name="username" id="username" required /><br />
          <label htmlFor="username">Full Name</label><br />
          <input type="text" name="fullname" id="fullname" required /><br />
          <label htmlFor="username">Email Address</label><br />
          <input type="text" name="email" id="email" required /><br />
          <label htmlFor="username">Password</label><br />
          <input type="password" name="password" id="password" required /><br />
          <label htmlFor="username">Profile Picture</label><br />
          <input type="file" name="file" id="file" required /><br />
          <input type="hidden" name="operation" value="create" />
          <input type="submit" value="create" />
        </form>
      </div>
    </div>
  </>,
  document.getElementById('reactEntry'),
);
