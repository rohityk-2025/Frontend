import "./CategoryGrid.css";

const categories = [
  {
    name: "Cars",
    icon: "https://img.icons8.com/color/96/car.png",
  },
  {
    name: "Bikes",
    icon: "https://img.icons8.com/color/96/motorcycle.png",
  },
  {
    name: "Electronics",
    icon: "https://img.icons8.com/color/96/fridge.png",
  },
  {
    name: "Mobiles",
    icon: "https://img.icons8.com/color/96/iphone.png",
  },
  {
    name: "Fashion",
    icon: "https://img.icons8.com/color/96/t-shirt.png",
  },
  {
    name: "Pets",
    icon: "https://img.icons8.com/color/96/dog.png",
  },
  {
    name: "Sports & Hobbies",
    icon: "https://img.icons8.com/color/96/guitar.png",
  },
];

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="category-card"
          onClick={() => onSelectCategory(cat.name)}
        >
          <div className="icon-box">
            <img src={cat.icon} alt={cat.name} />
          </div>
          <p>{cat.name}</p>
        </div>
      ))}
    </div>
  );
}
