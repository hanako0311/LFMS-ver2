import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashFoundItem from "../components/DashFoundItem";

const categories = [
  "Mobile Phones",
  "Laptops/Tablets",
  "Headphones/Earbuds",
  "Chargers and Cables",
  "Cameras",
  "Electronic Accessories",
  "Textbooks",
  "Notebooks",
  "Stationery Items",
  "Art Supplies",
  "Calculators",
  "Coats and Jackets",
  "Hats and Caps",
  "Scarves and Gloves",
  "Bags and Backpacks",
  "Sunglasses",
  "Jewelry and Watches",
  "Umbrellas",
  "Wallets and Purses",
  "ID Cards and Passports",
  "Keys",
  "Personal Care Items",
  "Sports Gear",
  "Gym Equipment",
  "Bicycles and Skateboards",
  "Musical Instruments",
  "Water Bottles",
  "Lunch Boxes",
  "Toys and Games",
  "Decorative Items",
  "Other",
];

export default function Search() {
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    sort: "desc",
    category: "all",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const params = {
      searchTerm: urlParams.get("searchTerm") || "",
      sort: urlParams.get("sort") || "desc",
      category: urlParams.get("category") || "all",
    };
    setSearchParams(params);
    fetchItems(params);
  }, [location.search]);

  const fetchItems = async ({ searchTerm, sort, category }) => {
    setLoading(true);
    const query = new URLSearchParams({
      searchTerm,
      sort,
      category,
    }).toString();
    try {
      const response = await fetch(`/api/items/getItems?${query}`); // Correct URL usage
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.items || []);
      setShowMore(data.items && data.items.length === 9);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      alert(`Failed to fetch items: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchParams((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/?${query}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              name="searchTerm"
              type="text"
              value={searchParams.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              name="sort"
              value={searchParams.sort}
              onChange={handleChange}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              name="category"
              value={searchParams.category}
              onChange={handleChange}
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Items Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            items.map((item) => <DashFoundItem key={item._id} item={item} />)
          )}
          {showMore && (
            <button
              onClick={() => handleShowMore()}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
