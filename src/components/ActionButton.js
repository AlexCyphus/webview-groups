import React from 'react';

function ActionButton({action, text, specId, fixed=false, color}) {

  if (fixed){var classes = "seeMoreButton fixed-button-pos "}
  else {var classes = "seeMoreButton "}

  if (color == "pink"){color = "pink-background"}
  else if (color == "blue"){color = "blue-background"}

  return ([
    <a className="no-underline" onClick={action}>
      <div className={"seeMoreContainer d-flex justify-content-center "} id={specId}>
        <div className={classes + color} >
          <p className="m-0 no-underline px-2">{text.toUpperCase()}</p>
        </div>
      </div>
    </a>
  ])
}

export default ActionButton
