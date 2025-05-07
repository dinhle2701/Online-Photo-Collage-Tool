import './App.css';
import Content from './components/Content/Content';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className="App bg-slate-200 px-12 h-svh py-10 leading-relaxed">
      <div class="grid grid-cols-[30%_1fr] grid-rows-[1fr] gap-y-[10px] gap-x-[30px] py-4">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}

export default App;
