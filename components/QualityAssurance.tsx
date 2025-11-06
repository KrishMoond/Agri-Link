import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../src/configs/firebase';
import { auctionService } from '../src/services/auctionService';

const QualityAssurance: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qualityImages, setQualityImages] = useState<File[]>([]);
  const [userProducts, setUserProducts] = useState<string[]>([]);
  const [qualityScore, setQualityScore] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user]);

  const fetchUserProducts = async () => {
    try {
      const auctionsQuery = query(
        collection(db, 'auctions'),
        where('sellerId', '==', user?.uid)
      );
      const auctionsSnapshot = await getDocs(auctionsQuery);
      const products = [...new Set(auctionsSnapshot.docs.map(doc => doc.data().itemName))];
      setUserProducts(products);
      if (products.length > 0 && !selectedProduct) {
        setSelectedProduct(products[0]);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  };

  const qualityChecks = [
    { id: 1, name: 'Color & Appearance', status: 'passed', score: 95 },
    { id: 2, name: 'Size Consistency', status: 'passed', score: 88 },
    { id: 3, name: 'Freshness', status: 'passed', score: 92 },
    { id: 4, name: 'No Damage/Defects', status: 'warning', score: 78 },
    { id: 5, name: 'Organic Certification', status: 'passed', score: 100 }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setQualityImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quality Assurance</h1>
          <p className="text-gray-600">Ensure your products meet quality standards</p>
        </div>

        {selectedProduct && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quality Score for {selectedProduct}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-600">{qualityScore || 'N/A'}</span>
                <span className="text-lg text-gray-500">/100</span>
              </div>
            </div>
            {qualityScore > 0 && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${qualityScore}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {qualityScore >= 90 ? 'Excellent quality - Premium grade' :
                   qualityScore >= 75 ? 'Good quality - Standard grade' :
                   'Needs improvement'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Product Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Product for Quality Check</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userProducts.length > 0 ? userProducts.map((product) => (
              <button
                key={product}
                onClick={() => setSelectedProduct(product)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedProduct === product
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🌾</div>
                <span className="text-sm font-medium">{product}</span>
              </button>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No products found in your auctions</p>
                <p className="text-sm">Create an auction to access quality checks</p>
              </div>
            )}
          </div>
        </div>

        {/* Quality Checks */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quality Assessment</h2>
          <div className="space-y-4">
            {qualityChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    check.status === 'passed' ? 'bg-green-500' :
                    check.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{check.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold">{check.score}/100</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    check.status === 'passed' ? 'bg-green-100 text-green-800' :
                    check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {check.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Quality Images</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="quality-images"
            />
            <label htmlFor="quality-images" className="cursor-pointer">
              <div className="text-4xl mb-4">📸</div>
              <p className="text-lg font-medium text-gray-700">Upload Product Images</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
            </label>
          </div>
          {qualityImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {qualityImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Quality check ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certification */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">🌱</span>
                <span className="font-semibold text-green-800">Organic Certified</span>
              </div>
              <p className="text-sm text-green-700">Valid until Dec 2024</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold text-blue-800">Premium Grade</span>
              </div>
              <p className="text-sm text-blue-700">Quality score {'>'}  90</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">🛡️</span>
                <span className="font-semibold text-purple-800">Safety Verified</span>
              </div>
              <p className="text-sm text-purple-700">Pesticide residue tested</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssurance;
