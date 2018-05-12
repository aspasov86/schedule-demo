import React from 'react';

import './Modal.css';

const modal = (props) => {
  let cssClass = ["Modal"];
  if (props.error) {
    cssClass.push('error');
  }
  return (
    <div className={cssClass.join(' ')}>
      <button
        className="close"
        onClick={props.closeWindow}>X</button>
      {props.children}
    </div>
  );
}


export default modal;
