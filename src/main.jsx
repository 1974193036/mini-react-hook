import ReactDOM from "react-dom/client";
import './index.css'

const jsx = (
  <div className="border">
    <h1>react</h1>
    <a href="https://www.baidu.com/">baidu</a>
    {/* <FunctionComponent name="函数组件" /> */}
    {/* <ClassComponent name="类组件" /> */}
    {/* <FragmentComponent /> */}
  </div>
);

console.log(jsx)

ReactDOM.createRoot(document.getElementById("root")).render(jsx);