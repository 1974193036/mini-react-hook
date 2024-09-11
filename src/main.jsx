/* eslint-disable react/prop-types */
// import ReactDOM from "react-dom/client";
import ReactDOM from "./myReact/react-dom";
import "./index.css";

// eslint-disable-next-line react-refresh/only-export-components
function FunctionComponent(props) {
  return (
    <div>
      <p>{props.name}</p>
      <button>按钮</button>
    </div>
  );
}

const jsx = (
  <div className="border">
    <h1>react</h1>
    <a href="https://www.baidu.com/">baidu</a>
    <FunctionComponent name="函数组件" />
    {/* <ClassComponent name="类组件" /> */}
    {/* <FragmentComponent /> */}
  </div>
);

console.log(jsx);

ReactDOM.createRoot(document.getElementById("root")).render(jsx);
