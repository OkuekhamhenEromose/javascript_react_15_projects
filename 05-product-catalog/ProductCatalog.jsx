import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from './productData';
import { useDebouncedValue } from './useDebouncedValue';

let filterComputeCount = 0; // exposed for testing - proves useMemo actually skips recomputation
export function getFilterComputeCount() {
  return filterComputeCount;
}
export function resetFilterComputeCount() {
  filterComputeCount = 0;
}

function ProductCatalog() {
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebouncedValue(rawQuery, 300);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // "name" | "price-asc" | "price-desc"
  const [unrelatedCounter, setUnrelatedCounter] = useState(0); // simulates unrelated re-renders

  const visibleProducts = useMemo(() => {
    filterComputeCount++; // count every time this EXPENSIVE block actually runs

    const query = debouncedQuery.toLowerCase();
    let result = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query));

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [debouncedQuery, category, sortBy]); // unrelatedCounter deliberately NOT a dependency

  return (
    <div>
      <input aria-label="Search products" value={rawQuery} onChange={(e) => setRawQuery(e.target.value)} />

      <label htmlFor="category-filter">Category</label>
      <select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <label htmlFor="sort-select">Sort by</label>
      <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      <button onClick={() => setUnrelatedCounter((c) => c + 1)}>Unrelated re-render trigger</button>

      {visibleProducts.length === 0 ? (
        <p>No products match your search.</p>
      ) : (
        <ul>
          {visibleProducts.map((p) => (
            <li key={p.id}>{p.name} — ${p.price.toFixed(2)} ({p.category})</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductCatalog;


// 13 errors


















































// import {useState, useMemo} from "react"
// import {PRODUCTS, CATEGORIES} from "./productData"
// import {useDebouncedValue} from "./useDebouncedValue"


// let filterComputeCount = 0

// export function getFilterComputeCount() {
//   return filterComputeCount
// }

// export function resetFilterComputeCount(){
//   filterComputeCount = 0
// }

// function ProductCatalog (){
//   const [sort, setSortBy] = useState('name')*
//   const [rawQuery, setRawQuery] = useState('')
//   const debouncedQuery = useDebouncedValue('rawQuery', 300)
//   const [category, setCategory] = useState('All')
//   const [unrelatedCounter, setUnrelatedCounter] = useState(0)

//   const visibleProducts = useMemo(()=>{*
//     const query = debouncedQuery.toLowerCase()

//     let result = PRODUCTS.filter((p)=>p.name.toLowerCase.includes(query))

//     if (category === 'All'){*
//       result = result.filter((p)=> p.category === category)
//     }

//     result = result.sort((a,b)=>{*
//       if (result === 'price-asc') return a.price - b.price*
//       if (result === 'price-desc') return b.price - a.price*
//       *
//     })
//     return result
//   }, [category, sort, debouncedQuery])

//   return (
//     <div>
//       <input key={category-filter} value={rawQuery} onChange={(e)=> setRawQuery(e.target.value)} />

//       <label htmlFor="product-filter">Sort</label>
//       <select id="category-filter" value= {category} onChange={(e)=> setCategory(e.target.value)}>
//         {CATEGORIES.map((c)=>(
//           <option value="c" key= {c}>{c}</option>
//         ))}
//       </select>

//         <label htmlFor="product-filter"> Sort</label>
//         <select id="product-filter" value={sort} onChange={onChange={(e)=> setSortBy(e.target.value)}} >
//           <option value="id"></option>
//           <option value="price-asc"></option>
//           <option value="price-desc"></option>
//         </select>
//         *8
//     </div>
//   )
// }

// export default ProductCatalog;
