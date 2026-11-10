const original = { name: 'Knox', km: 2.8 };
const alias = original;
const copy  = { ...original };

alias.km = 99; // what is original.km now?
               // 99

copy.km  = 1;  // and now?
               // still 99, because copy is a shallow copy of original, 
               // not a reference to it

const outer = { name: 'X', meta: { tags: ['steep'] } };
const shallow = { ...outer };

shallow.meta.tags.push('rocky'); // what is outer.meta.tags?
                                 // ['steep', 'rocky'] because shallow is a shallow copy of 
                                 // outer, so the meta object is still the same 
                                 // object in memory

({ x: 1 } === { x: 1 }) // will always return false because they are different objects 
                        // and === compares memory references, not values.