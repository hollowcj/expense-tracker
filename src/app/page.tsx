import Sidebar from "./components/Sidebar";
export default function Home() {
  return(
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
      </main>
    </div>
  )
}