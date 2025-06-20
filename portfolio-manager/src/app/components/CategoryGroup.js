import PortfolioItem from "./PortfolioItem";
import { useState } from "react";
import { AiOutlineUp, AiOutlineDown } from 'react-icons/ai';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function CategoryGroup({ title, items }) {
    const columns = [[], [], [], []];

    items.forEach((item, index) => {
        columns[index % 4].push(item);
    });

    const [open, setOpen] = useState(true);

    // return (
    //     <div className="m-8 mb-6 border border-gray-900/50 p-8 rounded-xl shadow-xl">
    //         <div className="flex items-center mb-4">
    //             <h2 className="text-xl font-semibold">{title}</h2>
    //             <button
    //                 className="ml-auto text-lg text-gray-700 hover:text-black"
    //                 onClick={() => setOpen(!open)}
    //                 aria-label="Toggle Category"
    //             >
    //             {open ? <FaChevronUp /> : <FaChevronDown />}
    //             </button>
    //         </div>
    //         {/* <h2 className="text-xl font-semibold mb-4">{title}<button className="cursor-pointer" onClick={() => setOpen(!open)}>{open ? '▴' : '▾'}</button></h2> */}
    //         {open && <div className="flex gap-4">
    //         {columns.map((group, i) => (
    //             <div key={i} className="flex-1 flex flex-col gap-4">
    //                 {group.map((item) => (
    //                 <PortfolioItem key={item.id} item={item} />
    //                  ))}
    //             </div>
    //         ))}
    //         </div>}
    //     </div>
    //  );
    return (
        <div className="m-6 mb-8 border border-b-2 border-teal-300 bg-slate-50 p-6 md:p-8 rounded-2xl shadow-lg transition-all">
            <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-teal-700">{title}</h2>
            <button
                className="ml-auto text-xl text-teal-700 font-semibold hover:text-teal-900 transition-colors"
                onClick={() => setOpen(!open)}
                aria-label="Toggle Category"
            >
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            </div>

            {open && (
            <div className="flex flex-col md:flex-row gap-6 transition-all duration-300 ease-in-out">
                {columns.map((group, i) => (
                <div key={i} className="flex-1 flex flex-col gap-4">
                    {group.map((item) => (
                    <PortfolioItem key={item.id} item={item} />
                    ))}
                </div>
                ))}
            </div>
            )}
        </div>
    );
}
