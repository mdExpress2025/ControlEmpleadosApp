"use client"


import { RouteGuard } from "@/components/RouteGuard"

function panelControl() {
    return (
        <RouteGuard permission="usuarios">
            <div className="flex items-center justify-center">
                <h1 className="text-[40px] ">panel de control proximamente...</h1>
            </div>
        </RouteGuard>
    )
}

export default panelControl;