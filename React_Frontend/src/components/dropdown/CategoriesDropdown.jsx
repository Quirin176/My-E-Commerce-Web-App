import { useState } from "react";
import { ChevronDown, Grid } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoriesDropdown({categories = [], textColor = "", listhoverBg = ""}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block font-semibold">
      <button className="flex items-center gap-2 px-4 py-2 border rounded font-semibold" style={{color: textColor}} onMouseEnter={() => setOpen(true)}>
        <Grid size={18} />
        <span className="text-lg">Categories</span>
        <ChevronDown size={18} className={`${open ? "rotate-180" : ""} transition`}/>
      </button>

      {/* DROPDOWN LIST */}
      {open && (
        <div className="absolute left-0 mt-2 w-60 bg-white border rounded shadow-lg p-2 z-50" onMouseLeave={() => setOpen(false)}>        
          {categories.map((item, index) => (
            <Link
              key={index}
              to={`/category/${encodeURIComponent(item.link)}`}
              className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-gray-800 hover:text-white transition">
                {/* IMAGE */}
                <img src={item.image} alt={item.label} className="w-10 h-10 object-cover rounded"/>
                <span className="text-lg font-medium">{item.label}</span> {/* SHOW CATEGORIES*/}
            </Link>
            ))}
        </div>
      )}
    </div>
  );
}
