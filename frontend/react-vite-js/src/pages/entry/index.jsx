import styles from "./index.module.scss";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

export default function Entry() {
  const navigate = useNavigate();

  let [numList, setNumList] = useImmer([
    {
      num: 1,
      isActive: true,
    },
    {
      num: 2,
      isActive: false,
    },
    {
      num: 3,
      isActive: false,
    },
    {
      num: 4,
      isActive: false,
    },
    {
      num: 5,
      isActive: false,
    },
  ]);

  function selectChange(current) {
    setNumList((draft) => {
      draft.forEach((item) => {
        item.isActive = item.num === current;
      });
    });
  }

  function choose() {
    navigate("/choose");
  }

  return (
    <div className={styles.orderIndex}>
      <div className="logo">
        <div className="mTuan">美团</div>
        <h5>美团</h5>
      </div>
      <div className="w-Xm">欢迎来到小民大排档（软件园店）</div>
      <div className="c-Num">
        <h5>客官，您几位？</h5>
        <p>桌号：3111</p>
        <ul>
          {numList.map((i) => (
            <li
              key={i.num}
              className={i.isActive ? "active" : ""}
              onClick={() => {
                selectChange(i.num);
              }}
            >
              {i.num}
            </li>
          ))}
        </ul>
        <div className="order" onClick={choose}>
          开始点餐
        </div>
      </div>
      <div className="footer">美团餐饮系统提供技术支持</div>
    </div>
  );
}
