import './App.css'
import SwapFormPage from "./page/SwapFormPage";
import {FC} from "react";
import {Toaster} from "@/components/ui/toaster.tsx";

const App: FC = () => {
  return (
    <>
        <SwapFormPage/>
        <Toaster/>
    </>
  )
}

export default App
