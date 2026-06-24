const dishes = [
  { dishName: "Butter Chicken", category: "Indian", isPublished: true },
  { dishName: "Pizza", category: "Italian", isPublished: true },
  { dishName: null, category: null, isPublished: true }
];

function testSearch(searchTerm) {
  return dishes.filter(dish => {
    const searchStr = (searchTerm || '').toLowerCase();
    const dishName = (dish.dishName || '').toLowerCase();
    const category = (dish.category || '').toLowerCase();
    
    return dishName.includes(searchStr) || category.includes(searchStr);
  });
}

console.log("Empty search:", testSearch(""));
console.log("Search 'butter':", testSearch("butter"));
console.log("Search 'indian':", testSearch("indian"));
