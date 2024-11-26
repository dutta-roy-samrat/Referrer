"use client"

import { useEffect } from "react";

const PageLoader = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, []);
    return < div className="flex justify-center items-center h-screen" >
        <div
            className="w-10 h-10 border-4 border-t-black border-gray-300 rounded-full animate-spin"
        ></div>
    </div >
}


export default PageLoader;