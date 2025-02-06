"use client"
import Image from "next/image";
import { RouteGuard } from "@/components/RouteGuard";

function Home() {
  return (
    <RouteGuard permission="inicio">
      <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono bg-gray-100">
        <div className="m-4 mt-[60px]">
          <h2 className="text-[30px] text-center">BIENVENIDO AL CONTROL DE EMPLEADOS</h2>
        </div>
        <div className="flex flex-col items-center gap-4 bg-slate-300 h-[430px] w-[350px] rounded-xl p-4 text-[15px]">


          <div className="w-[300px] flex flex-col items-center font-mono ">
            <div className="w-full text-center ">
              <div className="flex items-center justify-center mb-[10px]" >
                <Image src="/Image_Editor.png" alt="Logo MD express" width={80} height={80}
                  className="rounded-full "
                />
              </div>
              <h3 className="text-[25px] mb-[30px]">¿Para que sirve?</h3>
              <div className="bg-slate-400 rounded-[20px]">
                <p className="mt-[20px] text-[20px] p-1 py-2">
                  Esta es una aplicacion para llevar el control diario de los empleados, facilitando la gestion, organizacion y mejorando la rapidez.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </RouteGuard>
  )
}

export default Home;
