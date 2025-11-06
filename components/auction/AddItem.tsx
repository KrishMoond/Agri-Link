import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../../src/configs/auth";
import { auctionService } from "../../src/services/auctionService";
import { userService } from "../../src/services/userService";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Zod schema for form validation
const auctionSchema = z.object({
  itemName: z.string().min(1, "Item Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.number().min(1, "Price per unit must be at least 1"),
  auctionEndDate: z.date().refine(
    (date) => date.getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000,
    "Auction end date cannot be more than 3 days from today"
  ),
  image: z.any().optional(),
});

const generateShortAuctionId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const AuctionForm: React.FC = () => {
  const [itemName, setItemName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>("kg");
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);
  const [auctionEndDate, setAuctionEndDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // New state for image preview
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Get the current date formatted as "YYYY-MM-DD"
  const auctionStartDate: string = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          const user = await userService.getUserProfile();
          if (user) {
            setUserData({
              uid: user.uid,
              displayName: user.name || "Default Name",
              email: user.email || "Default Email",
              location: user.location?.[3] || "Default location",
              role: user.role || "buyer"
            });

            if (user.role !== "seller") {
              toast.error("You must be a seller to create an auction");
              navigate("/home");
            }
          } else {
            setUserData(null);
            navigate("/home");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUserData(null);
          navigate("/home");
        }
      } else {
        setUserData(null);
        navigate("/home");
      }
    };

    checkUser();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleAuctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData) {
      toast.error("You must be logged in to create an auction");
      return;
    }

    if (loading) return;

    const formData = {
      itemName,
      quantity,
      unit,
      pricePerUnit,
      auctionEndDate: new Date(auctionEndDate),
      image,
    };

    try {
      auctionSchema.parse(formData);
      setErrors({});
      setLoading(true);

      const auctionId = generateShortAuctionId();
      
      await auctionService.createAuction({
        auctionId,
        itemName,
        quantity,
        unit,
        pricePerUnit,
        auctionStartDate,
        auctionEndDate,
        sellerName: userData.displayName,
        sellerEmail: userData.email,
        sellerId: userData.uid,
        location: userData.location,
        imageUrl: "", // Image upload will be handled later
      });

      setItemName("");
      setQuantity(1);
      setUnit("kg");
      setPricePerUnit(0);
      setAuctionEndDate("");
      setImage(null);
      setImagePreview(null); // Clear preview
      setLoading(false);
      toast.success("Auction created successfully!");
      navigate("/auctions");
    } catch (error: any) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error("Error creating auction: " + error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center p-10">
      <form onSubmit={handleAuctionSubmit} className="space-y-4 p-4">
        <div>
          <label className="block text-gray-700">Item Name:</label>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {errors.itemName && <p className="text-red-500">{errors.itemName}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Unit:</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="kg">Kilogram (kg)</option>
            <option value="ton">Ton</option>
            <option value="quintal">Quintal</option>
          </select>
          {errors.unit && <p className="text-red-500">{errors.unit}</p>}
        </div>

        <div>
          <label className="block text-gray-700">Price per Unit:</label>
          <input
            type="number"
            placeholder="Price per Unit"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(Number(e.target.value))}
            className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {errors.pricePerUnit && (
            <p className="text-red-500">{errors.pricePerUnit}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Auction End Date:</label>
          <input
            type="date"
            value={auctionEndDate}
            onChange={(e) => setAuctionEndDate(e.target.value)}
            className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {errors.auctionEndDate && (
            <p className="text-red-500">{errors.auctionEndDate}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-full max-h-40 object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating Auction..." : "Create Auction"}
        </button>
      </form>
    </div>
  );
};

export default AuctionForm;
