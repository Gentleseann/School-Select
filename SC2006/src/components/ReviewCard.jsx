import { useState, useEffect } from "react";
import axios from "axios";

const ReviewCard = ({ name, onClose }) => {
  const [responds, setResponds] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, [name]);

  // Calculate average ratings
  const calculateAverages = () => {
    if (responds.length === 0) return null;
    
    const totals = responds.reduce((acc, review) => ({
      facilities: acc.facilities + (review.rating_facilities || 0),
      accessibility: acc.accessibility + (review.rating_accessibility || 0),
      usefulness: acc.usefulness + (review.rating_usefulness || 0)
    }), { facilities: 0, accessibility: 0, usefulness: 0 });
    
    return {
      facilities: (totals.facilities / responds.length).toFixed(1),
      accessibility: (totals.accessibility / responds.length).toFixed(1),
      usefulness: (totals.usefulness / responds.length).toFixed(1),
      overall: ((totals.facilities + totals.accessibility + totals.usefulness) / (responds.length * 3)).toFixed(1)
    };
  };

  const averages = calculateAverages();

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for:', name);
      
      const response = await axios.get(`http://localhost:5001/api/getReview`, {
        params: { name },
        withCredentials: true,
      });
      
      // Extract reviews array from response
      const reviewsData = response.data.reviews || [];
      setResponds(reviewsData);
      console.log(`Reviews loaded: ${reviewsData.length} reviews found`);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Set empty array on error so UI shows "No reviews available"
      setResponds([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#FAEDCE] p-6 w-[400px] rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">{name}</h2>

        {/* Average Ratings Summary */}
        {averages && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Average Ratings ({responds.length} review{responds.length !== 1 ? 's' : ''})</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{averages.overall}</div>
                <div className="text-sm text-gray-600">Overall</div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">🏢 Facilities</span>
                  <span className="font-semibold">{averages.facilities}/5</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">♿ Accessibility</span>
                  <span className="font-semibold">{averages.accessibility}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">📚 Usefulness</span>
                  <span className="font-semibold">{averages.usefulness}/5</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Reviews Section */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-700 sticky top-0 bg-[#FAEDCE] py-2">Individual Reviews</h3>
          {responds.length > 0 ? (
            responds.map((review, index) => (
              <div key={review.id || index} className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg font-semibold">Review by {review.username || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {review.reviewed_at ? new Date(review.reviewed_at).toLocaleDateString() : 'Date unknown'}
                  </p>
                </div>
                <div className="space-y-1 mb-3">
                  <p>🏢 Facilities: {review.rating_facilities}/5</p>
                  <p>♿ Accessibility: {review.rating_accessibility}/5</p>
                  <p>📚 Usefulness: {review.rating_usefulness}/5</p>
                </div>
                {review.review_comment && (
                  <p className="italic text-gray-700 bg-gray-50 p-2 rounded">
                    "{review.review_comment}"
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
