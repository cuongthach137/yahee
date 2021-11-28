import React from "react";
import { useHistory } from "react-router-dom";
import "./SubContents.styles.scss";

const SubContents = ({ category, setSub, setActive, handleOpenSub }) => {
  const history = useHistory();
  return (
    <>
      <h3 className="contents__title">{category.name}</h3>
      <div className="contents__subs">
        <ul className="contents__subs__subCates">
          {category.subCates.map((item, index) => (
            <li key={index}>
              <span
                onClick={() => {
                  setSub(false);
                  setActive(false);
                  handleOpenSub(category.name);
                  history.push(`/collections/${item.slug}`);
                }}
              >
                {item.name.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
        <div className="contents__subs__shop">
          {category.shopBy.map((item, index) => (
            <ul key={index} className="contents__subs__shop-by">
              <h4>{item.name}</h4>
              {item.options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSub(false);
                    setActive(false);
                    handleOpenSub(category.name);
                    history.push(`/${option.slug}`);
                  }}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="contents__subs__featured-image">
          <img src={category.image.scr} alt="" />
          <div className="contents__subs__featured-image__des">
            <p>{category.image.title}</p>
            <p>{category.image.subTitle}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubContents;
