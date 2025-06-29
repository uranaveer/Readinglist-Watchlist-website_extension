// NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import FuzzyText from "./Fuzzytext";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <FuzzyText 
        baseIntensity={0.1} 
        hoverIntensity={0.3} 
        enableHover={true}
      >
        404
      </FuzzyText>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition active:scale-95"
      >
        Go to Homepage
      </button>
    </div>
  );
}

export default NotFoundPage;
