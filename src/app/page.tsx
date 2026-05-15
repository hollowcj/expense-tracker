import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard/page";


export default function Home() {
  return(
    <div style={{display: 'flex', backgroundColor: 'white', minHeight: '100vh'}}>
      <Sidebar />
      

      <main style={{flex: 1}}>
        <Dashboard />
      </main>
    </div>
  )
}