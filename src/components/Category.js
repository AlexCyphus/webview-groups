import React from 'react';

function Category({data, onClick, itemType, randomData, index, chatsFlags}) {
  if (itemType == 'category'){
    return (
      <div className="row-item d-flex" onClick={onClick}>
        <div className="image-left d-flex">
          <img src={data.image} className="image m-auto"/>
        </div>
        <div className="content-right m-auto">
          <p className="bold item-content-title">{data.title}</p>
          <p>{data.description}</p>
        </div>
      </div>
    )
  } 

  else if (itemType == "chat"){
    return (
      <div className="row-item d-flex" onClick={onClick}>
        <div className="image-left d-flex">
          <img src={"/emojis/"+randomData.screensEmojis[index]+".svg"} className="image m-auto"/>
        </div>
        <div className="content-right">
          <p className="bold item-content-title min-70">{data}</p>
          <div className="bottom-row-info d-flex">
            <div className="col-auto p-0 pr-3 text-left"><p className="person-count">👤 {randomData.screensGroupSizes[index]}</p></div>
            <div className="col p-0 justify-content-end d-flex flag-holder">
              {chatsFlags.map((i) => {
                return <img src={"/emojis/"+i+".png"} className="flag"/>
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Category
