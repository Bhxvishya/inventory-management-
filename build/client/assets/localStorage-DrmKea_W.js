const o="inventory_products",r="inventory_transactions",a=()=>{if(typeof window>"u")return[];const t=localStorage.getItem(o);return t?JSON.parse(t):[]},c=t=>{const s=a(),n=s.findIndex(e=>e.id===t.id);n>=0?s[n]=t:s.push(t),localStorage.setItem(o,JSON.stringify(s))},d=()=>{if(typeof window>"u")return[];const t=localStorage.getItem(r);return t?JSON.parse(t):[]},u=t=>{const s=d();s.push(t),localStorage.setItem(r,JSON.stringify(s));const e=a().find(i=>i.id===t.productId);e&&(e.quantity+=t.type==="IN"?t.quantity:-t.quantity,c(e))};export{a,c as b,d as g,u as s};
