import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const NotFoundPage = ({ cart, wishlist }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate floating stars
    const newStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <title>Page Not Found - 404</title>
      <Header cart={cart} wishlist={wishlist} />

      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 border border-purple-300 rotate-45 animate-spin-slow opacity-20" />
        <div className="absolute top-40 right-20 w-12 h-12 bg-pink-400 rounded-full animate-float opacity-30" />
        <div className="absolute bottom-40 left-20 w-20 h-20 border border-blue-300 rotate-12 animate-spin-slow opacity-25" />
        <div className="absolute bottom-20 right-10 w-8 h-8 bg-indigo-400 rounded-full animate-float-delayed opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Main 404 Display */}
          <div className="mb-12 relative">
            <div className="relative inline-block">
              <h1 className="text-9xl md:text-10xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse-glow">
                404
              </h1>
              {/* Glow effect behind 404 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-30 animate-pulse" />
            </div>
          </div>

          {/* Animated Character */}
          <div className="mb-12 relative">
            <div className="text-8xl md:text-9xl animate-bounce-gentle">
              🚀
            </div>
            {/* Trail effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-pulse opacity-50" />
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Lost in Space! 🌌
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto animate-fade-in-delay leading-relaxed">
              Oops! It looks like this page has drifted off into the cosmos.
              <br className="hidden sm:block" />
              Don't panic! Our mission control can help you navigate back to familiar territory.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
              <Link
                to="/"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center">
                  🏠 Mission Control
                </span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="group relative inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white text-lg font-semibold rounded-full border border-white/30 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/30"
              >
                <span className="relative flex items-center">
                  ⬅️ Previous Sector
                </span>
              </button>
            </div>

            {/* Navigation Grid */}
            <div className="mt-16 animate-fade-in-delay-2">
              <p className="text-purple-200 mb-6 text-lg">
                Popular Destinations:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { name: "Home", path: "/", emoji: "🏠" },
                  { name: "Products", path: "/products", emoji: "🛍️" },
                  { name: "Categories", path: "/categories", emoji: "📂" },
                  { name: "About", path: "/about", emoji: "ℹ️" },
                ].map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="group p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-200 text-center"
                  >
                    <div className="text-2xl mb-2 group-hover:animate-bounce">
                      {link.emoji}
                    </div>
                    <div className="text-sm font-medium">{link.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Fun floating elements */}
          <div className="absolute top-1/4 left-4 opacity-20 animate-float">
            <div className="w-4 h-4 bg-yellow-300 rounded-full" />
          </div>
          <div className="absolute top-1/3 right-8 opacity-30 animate-float-delayed">
            <div className="w-6 h-6 bg-green-300 rounded-full" />
          </div>
          <div className="absolute bottom-1/4 left-8 opacity-25 animate-float">
            <div className="w-3 h-3 bg-blue-300 rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            text-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.5);
          }
        }

        @keyframes bounce-gentle {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          40% {
            transform: translateY(-15px) rotate(2deg);
          }
          60% {
            transform: translateY(-7px) rotate(-1deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay-2 {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 0.8s ease-out 0.6s both;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
