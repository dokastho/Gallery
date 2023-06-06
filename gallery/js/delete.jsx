import React from 'react';
import { render } from 'react-dom';
import Topbar from './topbar';

render(
  <><Topbar logname={''} /><div className='account-background'>
    <div className='account-view'>
      <form action="/accounts/?target=/" method="post">
        <input type="hidden" name="operation" value="delete" />
        <label htmlFor='deleteacct'>Are You Sure?</label>
        <input id="deleteacct" type="submit" value="Confirm" />
      </form>
    </div>
  </div></>,
  document.getElementById('reactEntry'),
);
