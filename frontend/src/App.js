import { useState } from 'react';
import './App.css';
import Content from './components/Content/Content';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const [taskId, setTaskId] = useState(null);

  return (
    <div className="App bg-slate-200 px-4 sm:px-12 leading-relaxed min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-y-4 md:gap-y-0 gap-x-6 md:gap-x-10 min-h-[80vh]">
        <Sidebar setCollageId={setTaskId} />
        <Content collageId={taskId} />
      </div>
    </div>
  );
}

export default App;
