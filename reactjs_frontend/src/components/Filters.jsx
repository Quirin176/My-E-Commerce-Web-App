// import React from "react";

// export default function Filters({brand, setBrand, minPrice, setMinPrice, maxPrice, setMaxPrice, priceOrder, setPriceOrder, brands = []}) {
//   return (
//     <div className="p-4 mb-6 border rounded bg-white shadow-sm flex gap-4 items-end">
//       {/* BRAND FILTER */}
//       <div className="flex flex-col">
//         <label className="block font-medium text-center text-sm mb-1">Brand</label>
//         <select
//           className="border p-1.5 w-28 rounded text-sm"
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}>

//           <option value="">All</option>
//           {brands.map((b) => (
//             <option key={b} value={b.toLowerCase()}>
//               {b}
//             </option>
//           ))}
//           </select>
//       </div>

//       {/* PRICE RANGE */}
//       <div className="flex flex-col">
//         <label className="block font-medium text-center text-sm mb-1">Price Range (VND)</label>
//         <div className="flex gap-2">
//           <input
//             placeholder="Min"
//             className="border p-1.5 rounded w-24 text-sm"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}/>
//           <input
//             placeholder="Max"
//             className="border p-1.5 rounded w-24 text-sm"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}/>
//         </div>
//       </div>

//       <div className="flex flex-col">
//         <label className="block font-medium text-center text-sm mb-1">Sort</label>
//         <select
//         className="border p-1.5 w-32 rounded text-sm"
//         value={priceOrder}
//         onChange={(e) => setPriceOrder(e.target.value)}>
          
//         <option value="newest">Newest</option>
//         <option value="ascending">Low → High</option>
//         <option value="descending">High → Low</option>
//         </select>
//         </div>
//     </div>
//   );
// }
