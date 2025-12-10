// import { useEffect, useState } from "react";
// import { getFilters } from "../api";

// function Filters({ productTypeId, onFilterChange }) {
//   const [categories, setCategories] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   useEffect(() => {
//     getFilters(productTypeId).then(data => setCategories(data));
//   }, [productTypeId]);

//   const toggleOption = (id) => {
//     let updated;

//     if (selectedOptions.includes(id)) {
//       updated = selectedOptions.filter(o => o !== id);
//     } else {
//       updated = [...selectedOptions, id];
//     }

//     setSelectedOptions(updated);
//     onFilterChange(updated);
//   };

//   return (
//     <div>
//       {categories.map(cat => (
//         <div key={cat.categoryId}>
//           <h4>{cat.name}</h4>

//           {cat.filterOptions.map(opt => (
//             <label key={opt.optionId}>
//               <input
//                 type="checkbox"
//                 value={opt.optionId}
//                 onChange={() => toggleOption(opt.optionId)}
//                 checked={selectedOptions.includes(opt.optionId)}
//               />
//               {opt.optionName}
//             </label>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Filters;
