import { useState } from 'react';
import './App.css';
import Content from './components/Content/Content';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const [taskId, setTaskId] = useState(null);
  return (
    <div className="App bg-slate-200 px-12 leading-relaxed">
      <div class="gridbox grid grid-cols-[30%_1fr] grid-rows-[1fr] gap-y-[10px] gap-x-[30px]">
        <Sidebar setCollageId={setTaskId}/>
        <Content collageId={taskId}/>
      </div>
    </div>
  );
}

export default App;
