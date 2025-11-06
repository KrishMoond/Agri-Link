import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../../src/configs/auth";
import { auctionService } from "../../src/services/auctionService";
import { userService } from "../../src/services/userService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TopBid = {
  bidAmount: number;
  userId: string;
  userName?: string;
  location?: string;
  phone?: string;
};

const PriceList: React.FC = () => {
  const location = useLocation();
  const auction = location.state?.auction;

  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [currentBid, setCurrentBid] = useState<number>(auction.pricePerUnit);
  const [topBids, setTopBids] = useState<TopBid[]>(auction.topBids || []);
  const [currentUser, setCurrentUser] = useState<{
    userId: string;
    role: string;
    userName?: string;
  } | null>(null);

  if (!auction) {
    return <div>No auction data available.</div>;
  }

  useEffect(() => {
    const loadUser = async () => {
      const user = getCurrentUser();
      if (user) {
        const userData = await userService.getUserProfile();
        if (userData) {
          setCurrentUser({
            userId: userData.uid,
            role: userData.role,
            userName: userData.name,
          });
        }
      }
    };
    loadUser();
  }, []);

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      const userData = await userService.getUserById(userId);
      if (userData) {
        return {
          userName: userData.name || "Unknown User",
          location: userData.location || "Unknown Location",
          phone: userData.phone || "Unknown Phone",
        };
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
    return {
      userName: "Unknown User",
      location: "Unknown Location",
      phone: "Unknown Phone",
    };
  }, []);

  useEffect(() => {
    const fetchTopBidDetails = async () => {
      const updatedBids = await Promise.all(
        topBids.map(async (bid) => {
          const userDetails = await fetchUserDetails(bid.userId);
          return { ...bid, ...userDetails };
        })
      );
      setTopBids(updatedBids);
    };
    fetchTopBidDetails();
  }, [topBids, fetchUserDetails]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value === "" ? "" : Number(value));
  };

  const handlePlaceBid = async () => {
    if (bidAmount === "") {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    const newBid = { bidAmount, userId: currentUser?.userId as string };
    const updatedBids = [...topBids, newBid]
      .sort((a, b) => b.bidAmount - a.bidAmount)
      .slice(0, 5);

    setTopBids(updatedBids);

    try {
      await auctionService.placeBid(auction.id, newBid);
      setCurrentBid(updatedBids[0].bidAmount);
      toast.success("Bid submitted successfully!");
    } catch (error) {
      toast.error("Error submitting bid.");
      console.error("Error updating auction bids:", error);
    }
  };

  const endDate = auction.auctionEndDate;

  return (
    <div className="max-w-4xl mx-auto pb-[10%]">
      <ToastContainer />
      <div className="p-4 flex justify-center">
        <img
          src={auction.imageUrl}
          alt={auction.itemName}
          className="h-56 w-auto max-w-full object-cover rounded-lg shadow-lg mb-4"
        />
      </div>

      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold mb-2">Bidding Details</h2>
        <p className="text-gray-500">End Date: {endDate}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-center mb-4">
          <p className="text-lg font-medium text-gray-700">Current Bid:</p>
          <p className="text-2xl font-bold ml-2">
            ₹{currentBid.toFixed(2)} per {auction.unit}
          </p>
        </div>

        {currentUser?.role === "buyer" && (
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <input
              type="number"
              value={bidAmount === "" ? "" : bidAmount}
              onChange={handleBidChange}
              placeholder="Enter your bid amount"
              className="p-3 border rounded-md w-full sm:w-60"
            />
            <button
              onClick={handlePlaceBid}
              className="bg-green-500 text-white p-3 rounded-md font-bold w-full sm:w-auto"
            >
              Place Bid
            </button>
          </div>
        )}

        {currentUser?.role !== "buyer" && (
          <div className="mt-8 overflow-scroll">
            <h3 className="text-lg font-bold mb-4">Top 5 Bids:</h3>
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-200">Rank</th>
                  <th className="px-4 py-2 bg-gray-200">Bid Amount</th>
                  <th className="px-4 py-2 bg-gray-200">User Name</th>
                  <th className="px-4 py-2 bg-gray-200">Location/Phone no.</th>
                </tr>
              </thead>
              <tbody>
                {topBids.map((bid, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      ₹{bid.bidAmount.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {bid.userName || bid.userId}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {Array.isArray(bid.location)
                        ? bid.location.join(",")
                        : bid.location}{" "}
                      <br />
                      {bid.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceList;
